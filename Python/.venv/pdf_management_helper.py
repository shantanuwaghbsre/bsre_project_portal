import win32com.client
import pythoncom
from jinja2 import Environment, FileSystemLoader
import sys
import os
from docx import Document
from docx.text.run import Run
import datetime
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX
from docx.shared import Pt, RGBColor
import pdfkit
from pypdf import PdfReader, PdfWriter
import matplotlib.pyplot as plt
from dotenv import load_dotenv
load_dotenv()

def create_line_graph(X_data, Y_data, X_label, Y_label, color_, width_, title, filename, figsize_=(10, 8)):
    """
    Create and display a line graph.

    Args:
        x_data (list): List of x-axis data points.
        y_data (list): List of y-axis data points.
        x_label (str): Label for the x-axis.
        y_label (str): Label for the y-axis.
        title (str): Title of the graph.
    """
    plt.figure(figsize=figsize_)
    plt.plot(X_data, Y_data, color=color_, linewidth=width_)
    plt.xlabel(X_label)
    plt.ylabel(Y_label)
    plt.title(title)
    # Save the graph to a file
    plt.savefig(os.environ.get("GRAPHS_FOLDER") + filename)

def create_bar_graph(X_data, Y_data, X_label, Y_label, color_, width_, title, filename, individual_bar_values_requested, figsize_=(10, 8)):
    """
    Create and save a bar graph.

    Args:
        X_data (list): List of x-axis data points.
        Y_data (list): List of y-axis data points.
        X_label (str): Label for the x-axis.
        Y_label (str): Label for the y-axis.
        color_ (str): Color of the bars.
        width_ (float): Width of the bars.
        title (str): Title of the graph.
        filename (str): File name to save the graph.
        figsize_ (tuple, optional): Figure size. Defaults to (10, 8).
    """
    # Create the figure and axes
    fig, ax = plt.subplots(figsize=figsize_)

    # Set the x-axis tick labels and rotation
    ax.set_xticklabels(list(X_data), rotation=45, ha="right")

    # Create the bar plot
    plt.bar(X_data, Y_data, color=color_, width=width_)

    # Set the x-axis and y-axis labels
    plt.xlabel(X_label)
    plt.ylabel(Y_label)

    # Add the data values on top of the bars
    if individual_bar_values_requested:
        for i in range(len(X_data)):
            plt.text(i, Y_data[i] // 2, Y_data[i], ha='center')

    # Set the graph title
    plt.title(title)

    # Save the graph to a file
    plt.savefig(os.environ.get("GRAPHS_FOLDER") + filename)



def create_html_from_template(context):
    """
    Create an HTML file from a template.
    
    Args:
        context (dict): A dictionary containing the necessary values to render the template.
        
    Returns:
        str: The file path of the generated HTML file.
    """

    # Get the path to the templates folder from environment variable
    templates_folder = os.environ.get('TEMPLATES_FOLDER')
    
    # Get the necessary values from the context dictionary
    quotation_type = context["quotation_type"]
    quotation_number = context['quotation_number'].replace('/', '_')
    consumer_name = context['consumer_name']
    
    # Determine the template name based on the quotation type
    template_name = "residentialQuotation.html" if quotation_type == "Residential" else "industrialQuotation.html"
    
    # Generate a unique file path for the HTML file
    html_file_path = os.path.join(os.environ.get("TEMPORARY_FILES_FOLDER"), f"Quotation number {quotation_number} for {consumer_name}.html")
    
    # Create an environment for loading templates from the templates folder
    environment = Environment(loader=FileSystemLoader(templates_folder))
    
    # Get the template object based on the template path
    template = environment.get_template(template_name)
    
    # Open the HTML file in write mode and write the rendered template content
    with open(html_file_path, mode="w+", encoding="utf-8") as results:
        results.write(template.render(context))
        print(f"... wrote {html_file_path}")
    
    # Return the file path of the generated HTML file
    return html_file_path


def create_encrypted_pdf_from_html(html_file_path, context):
    """
    Create an encrypted PDF file from an HTML file.

    Args:
        html_file_path (str): The file path of the HTML file.
        context (dict): A dictionary containing the necessary values.

    Returns:
        None
    """
    # Set the path for the temporary PDF file
    temp_pdf_path = os.path.join(os.environ.get("TEMPORARY_FILES_FOLDER"), 'temp.pdf')

    # Convert the HTML file to a PDF file
    pdfkit.from_file(html_file_path, temp_pdf_path, options={"enable-local-file-access": ""})

    # Read the PDF file
    reader = PdfReader(temp_pdf_path)

    # Create a new PDF writer
    writer = PdfWriter()

    # Append the pages from the reader to the writer
    writer.append_pages_from_reader(reader)

    # Encrypt the PDF file using the last 4 digits of the quotation number and the consumer mobile number
    # writer.encrypt(context['quotation_number'][-4:]+'/'+str(context['consumer_mobile_number']))

    # Set the output PDF file path
    output_pdf_path = html_file_path.rstrip('.html') + '.pdf'

    # Write the output PDF file
    with open(output_pdf_path, "wb") as out_file:
        writer.write(out_file)

    # Remove the temporary PDF file and the HTML file
    os.remove(temp_pdf_path)
    os.remove(html_file_path)

def create_pdf_from_doc(doc_file_name, context):
    """
    Create a PDF file from a Word document.

    Args:
        docx_file_path (str): The file path of the Word document.

    Returns:
        None
    """

    d = Document(os.environ.get("TEMPLATES_FOLDER") + doc_file_name + '.docx')
    if d.sections is not None and len(d.sections) > 0:
        for s in d.sections:
            for id_, hp in enumerate(s.header.paragraphs):
                if "{{ " in hp.text:
                    para_text = hp.text
                    hp.clear()
                    for run in para_text.split("  "):
                        hp.add_run(run)
                        for idx, run in enumerate(hp.runs):
                            for i in range(run.text.count("{{ ")):
                                run.text = run.text.split("{{ ", 1)[0] + context[run.text.split("{{ ", 1)[1].split(" }}")[0]] + (run.text.split("{{ ", 1)[1].split(" }}", 1)[1] if len(run.text.split("{{ ", 1)[1].split(" }}", 1)[1]) > 1 else '')
                            if idx == 1:
                                run.font.highlight_color = WD_COLOR_INDEX.BLACK
                                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                        if not idx:
                            run.text += " | "
                        elif idx == 2:
                            run.text = " | " + run.text

    for p in d.paragraphs:
        placeholder_count = p.text.count("{{")
        if placeholder_count:
            whole_para_text = p.text
            p.clear()
            for i in range(placeholder_count):
                # print("index", i, "whole", whole_para_text)
                split_para = whole_para_text.split("{{ ", 1)
                if len(split_para[0]):
                    before_para = p.add_run(split_para[0])
                    before_para.bold = False
                # print(split_para)
                # print(len(context[split_para[1].split(" }}", 1)[0]]))
                styled_run = p.add_run(context[split_para[1].split(" }}", 1)[0]])
                styled_run.bold = True
                styled_run.underline = True
                styled_run.font.size = Pt(12)
                whole_para_text = split_para[1].split(" }}", 1)[1]
            after_para = p.add_run(whole_para_text)
            after_para.bold = False
    
    for t in d.tables:
        for r in t.rows:
            for c in r.cells:
                placeholder_count = c.text.count("{{")
                if placeholder_count:
                    whole_para_text = c.text
                    for paragraph in c.paragraphs:
                        c._element.remove(paragraph._element)
                    p = c.add_paragraph()
                    p.clear()
                    p.alignment=WD_ALIGN_PARAGRAPH.CENTER
                    for i in range(placeholder_count):
                        split_para = whole_para_text.split("{{ ", 1)
                        if len(split_para[0]):
                            before_para = p.add_run(split_para[0])
                            before_para.bold = False
                        try:
                            styled_run = p.add_run(context[split_para[1].split(" }}", 1)[0]])
                            styled_run.bold = True
                            styled_run.underline = True
                            styled_run.font.size = Pt(12)
                        except:
                            # print("passed")
                            pass
                        try:
                            whole_para_text = split_para[1].split(" }}", 1)[1]
                        except:
                            whole_para_text = ''
                    after_para = p.add_run(whole_para_text)
                    after_para.bold = False
    
    d.save(os.environ.get("TEMPORARY_FILES_FOLDER") + doc_file_name + '_edited.docx')

    wdFormatPDF = 17

    in_file = os.environ.get("TEMPORARY_FILES_FOLDER") + doc_file_name + '_edited.docx'

    out_file = os.environ.get("TEMPORARY_FILES_FOLDER") + doc_file_name + '_edited.pdf'

    pythoncom.CoInitialize()

    word_app = win32com.client.Dispatch("Word.Application")

    # Open the DOCX file
    doc = word_app.Documents.Open(in_file)

    # Save as PDF
    doc.SaveAs(out_file, FileFormat=17)  # 17 corresponds to PDF format

    # Close the document
    doc.Close()

    # Quit Word application
    word_app.Quit()
    pythoncom.CoUninitialize()
    print(os.environ.get("TEMPORARY_FILES_FOLDER") + doc_file_name + '_edited.pdf')
    return os.environ.get("TEMPORARY_FILES_FOLDER") + doc_file_name + '_edited.pdf'