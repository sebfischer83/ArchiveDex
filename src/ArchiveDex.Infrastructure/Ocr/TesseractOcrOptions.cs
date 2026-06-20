namespace ArchiveDex.Infrastructure.Ocr
{
    public sealed class TesseractOcrOptions
    {
        public string ImageBasePath { get; set; } = "/app/images";
        public string TessDataPath { get; set; } = "/usr/share/tesseract-ocr/5/tessdata";
        public string DefaultLanguages { get; set; } = "eng+deu+jpn+kor+chi_sim+chi_tra";
    }
}
