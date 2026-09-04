import os
import sys

def convert_pptx_to_pdf(pptx_path, pdf_path):
    pptx_path = os.path.abspath(pptx_path)
    pdf_path = os.path.abspath(pdf_path)
    print(f"Converting {pptx_path} to {pdf_path}...")

    # Method 1: PyWin32 (MS PowerPoint COM)
    try:
        import win32com.client
        print("Attempting conversion via PowerPoint COM interface...")
        powerpoint = win32com.client.Dispatch("PowerPoint.Application")
        # 17 = ppSaveAsPDF (or 32)
        presentation = powerpoint.Presentations.Open(pptx_path, WithWindow=False)
        presentation.SaveAs(pdf_path, 32) # 32 is ppSaveAsPDF
        presentation.Close()
        powerpoint.Quit()
        print("Successfully converted PPTX to PDF using PowerPoint COM!")
        return True
    except Exception as e:
        print(f"PowerPoint COM method unavailable or failed: {e}")

    # Method 2: LibreOffice / soffice CLI
    try:
        import subprocess
        print("Attempting conversion via LibreOffice / soffice CLI...")
        res = subprocess.run(["soffice", "--headless", "--convert-to", "pdf", pptx_path, "--outdir", os.path.dirname(pdf_path)], capture_output=True, text=True)
        if res.returncode == 0 and os.path.exists(pdf_path):
            print("Successfully converted PPTX to PDF using LibreOffice!")
            return True
        else:
            print(f"LibreOffice conversion failed: {res.stderr}")
    except Exception as e:
        print(f"LibreOffice CLI unavailable: {e}")

    # Method 3: PowerShell COM script
    try:
        import subprocess
        print("Attempting conversion via PowerShell COM script...")
        ps_script = f"""
        $ppt = New-Object -ComObject PowerPoint.Application
        $pres = $ppt.Presentations.Open('{pptx_path}')
        $pres.SaveAs('{pdf_path}', 32)
        $pres.Close()
        $ppt.Quit()
        """
        res = subprocess.run(["powershell", "-Command", ps_script], capture_output=True, text=True)
        if os.path.exists(pdf_path):
            print("Successfully converted PPTX to PDF using PowerShell COM!")
            return True
        else:
            print(f"PowerShell COM conversion output: {res.stderr}")
    except Exception as e:
        print(f"PowerShell method failed: {e}")

    return False

if __name__ == "__main__":
    pptx_f = os.path.join("ppt", "Vanika_SIH_2026_Presentation.pptx")
    pdf_f = os.path.join("ppt", "Vanika_SIH_2026_Presentation.pdf")
    success = convert_pptx_to_pdf(pptx_f, pdf_f)
    if not success:
        print("Warning: Automatic PPTX to PDF conversion could not locate PowerPoint or LibreOffice CLI.")
        sys.exit(1)
