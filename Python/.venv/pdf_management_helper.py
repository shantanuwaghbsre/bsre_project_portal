from jinja2 import Environment, FileSystemLoader
import os
import pdfkit
from pypdf import PdfReader, PdfWriter

def create_html_from_template(context):
    environment = Environment(loader=FileSystemLoader(os.getcwd()+"/Python/.venv/templates/"))
    template = environment.get_template("residentialQuotation.html")
    context['guvnl_amount'] = int(context['guvnl_amount'])
    context['subsidy'] = int(context['subsidy'])

    html_file_path = f"Quotation number %s for %s.html" % (context['quotation_number'].replace('/', '_'), context['consumer_name'])
    with open(html_file_path, mode="w+", encoding="utf-8") as results:
        results.write(template.render(context))
        print(f"... wrote {html_file_path}") 
    return html_file_path

def create_encrypted_pdf_from_html(html_file_path, context):
    pdfkit.from_file(html_file_path, 'temp.pdf')
    reader = PdfReader('temp.pdf')
    writer = PdfWriter()
    writer.append_pages_from_reader(reader)
    writer.encrypt(context['quotation_number'][-4:]+'/'+str(context['consumer_mobile_number']))

    with open(html_file_path.rstrip('.html')+'.pdf', "wb") as out_file:
        writer.write(out_file)
    
    os.remove('temp.pdf')
    os.remove(html_file_path)
