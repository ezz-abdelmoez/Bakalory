#!/usr/bin/env python3
"""Generate placeholder lesson assets under public/lessons/.

Creates a minimal-but-valid PDF, PPTX, ZIP, PNG, .py and .sql file for each
lesson so that resource download/view links resolve to real static files.
"""
import base64
import io
import os
import struct
import zipfile
import zlib

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "lessons")


def minimal_pdf(text: str) -> bytes:
    stream = f"BT /F1 24 Tf 72 700 Td ({text}) Tj ET".encode("latin-1", "replace")
    objects = [
        b"<</Type/Catalog/Pages 2 0 R>>",
        b"<</Type/Pages/Kids[3 0 R]/Count 1>>",
        b"<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>",
        b"<</Length " + str(len(stream)).encode() + b">>stream\n" + stream + b"\nendstream",
        b"<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
    ]
    out = bytearray(b"%PDF-1.4\n")
    offsets = []
    for i, obj in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{i} 0 obj".encode() + obj + b"\nendobj\n"
    xref_pos = len(out)
    out += f"xref\n0 {len(objects)+1}\n".encode()
    out += b"0000000000 65535 f \n"
    for off in offsets:
        out += f"{off:010d} 00000 n \n".encode()
    out += (
        f"trailer<</Size {len(objects)+1}/Root 1 0 R>>\nstartxref\n{xref_pos}\n%%EOF\n".encode()
    )
    return bytes(out)


def minimal_pptx() -> bytes:
    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>'
        '<Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'
        "</Types>"
    )
    rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>'
        "</Relationships>"
    )
    presentation = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
        '<p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst>'
        '<p:sldSz cx="9144000" cy="6858000"/>'
        "</p:presentation>"
    )
    presentation_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>'
        "</Relationships>"
    )
    slide = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
        '<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>'
        "</p:sld>"
    )
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types)
        zf.writestr("_rels/.rels", rels)
        zf.writestr("ppt/presentation.xml", presentation)
        zf.writestr("ppt/_rels/presentation.xml.rels", presentation_rels)
        zf.writestr("ppt/slides/slide1.xml", slide)
        zf.writestr("ppt/slides/_rels/slide1.xml.rels", presentation_rels)
    return buffer.getvalue()


def minimal_png(size: int = 32, color: tuple = (11, 110, 153)) -> bytes:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    raw = b"".join(
        b"\x00" + bytes(color) * size for _ in range(size)
    )
    idat = zlib.compress(raw)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


def exercises_zip(text: str) -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("README.txt", text)
        zf.writestr("exercises.txt", text)
    return buffer.getvalue()


LESSONS = {
    1: ("example.py", "python"),
    2: (None, "image"),
    3: ("sorting_searching.py", "python"),
    4: ("basics.py", "python"),
    5: ("conditionals.py", "python"),
    6: ("loops.py", "python"),
    7: ("functions.py", "python"),
    8: ("create_table.sql", "sql"),
    9: ("queries.sql", "sql"),
}

TITLES = {
    1: "مقدمة في الخوارزميات",
    2: "الخوارزميات والمخططات الانسيابية",
    3: "الترتيب والبحث في المصفوفات",
    4: "أساسيات لغة Python",
    5: "الجمل الشرطية في Python",
    6: "الحلقات التكرارية",
    7: "الدوال والوحدات البرمجية",
    8: "مقدمة في قواعد البيانات و SQL",
    9: "الاستعلامات الأساسية في SQL",
}

PY_EXAMPLES = {
    1: "# مثال: خوارزمية جمع عددين\nx = 5\ny = 3\nprint(x + y)\n",
    3: "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\nprint(bubble_sort([5, 3, 8, 1]))\n",
    4: "# المتغيرات وأنواع البيانات\nname = \"أحمد\"\nage = 17\nprint(name, age)\n",
    5: "score = 16\nif score >= 10:\n    print(\"ناجح\")\nelse:\n    print(\"غير ناجح\")\n",
    6: "for i in range(1, 6):\n    print(i)\n",
    7: "def add(a, b):\n    return a + b\n\nprint(add(3, 5))\n",
}

SQL_EXAMPLES = {
    8: "CREATE TABLE students (\n    id INTEGER PRIMARY KEY,\n    name TEXT NOT NULL,\n    class TEXT NOT NULL\n);\n",
    9: "SELECT name, grade\nFROM students\nWHERE grade >= 14\nORDER BY grade DESC;\n",
}


def main():
    for number in range(1, 10):
        lesson_dir = os.path.join(ROOT, f"lesson-{number:02d}")
        title = TITLES[number]

        os.makedirs(os.path.join(lesson_dir, "pdf"), exist_ok=True)
        os.makedirs(os.path.join(lesson_dir, "slides"), exist_ok=True)
        os.makedirs(os.path.join(lesson_dir, "files"), exist_ok=True)
        os.makedirs(os.path.join(lesson_dir, "code"), exist_ok=True)
        os.makedirs(os.path.join(lesson_dir, "images"), exist_ok=True)

        with open(os.path.join(lesson_dir, "pdf", "lesson.pdf"), "wb") as fh:
            fh.write(minimal_pdf(f"Programming 2 Bac - Lesson {number}"))

        with open(os.path.join(lesson_dir, "slides", "lesson.pptx"), "wb") as fh:
            fh.write(minimal_pptx())

        with open(os.path.join(lesson_dir, "files", "exercises.zip"), "wb") as fh:
            fh.write(exercises_zip(f"تمارين الدرس {number}: {title}\n"))

        if number == 2:
            with open(os.path.join(lesson_dir, "images", "flowchart.png"), "wb") as fh:
                fh.write(minimal_png(64, (11, 110, 153)))
        elif number == 3:
            with open(os.path.join(lesson_dir, "images", "binary-search.png"), "wb") as fh:
                fh.write(minimal_png(64, (80, 150, 80)))

        code_file = LESSONS[number][0]
        if code_file:
            content = (
                PY_EXAMPLES.get(number)
                if code_file.endswith(".py")
                else SQL_EXAMPLES.get(number, "")
            )
            with open(os.path.join(lesson_dir, "code", code_file), "w", encoding="utf-8") as fh:
                fh.write(content)

    print("Placeholder assets generated.")


if __name__ == "__main__":
    main()
