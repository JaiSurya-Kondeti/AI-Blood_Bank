import fitz


class PDFService:

    @staticmethod
    def extract_text(file_path):

        text = ""

        pdf = fitz.open(file_path)

        for page in pdf:
            text += page.get_text()

        return text