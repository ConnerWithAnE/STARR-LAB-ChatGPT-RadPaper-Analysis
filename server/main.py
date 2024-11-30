"""
Title: OpenAI--gpt-4o--Radiation Paper Analysis
Supervisor: Dr. Li Chen (ECE--USASK)
Creator: Daylen Feist, Shiv Krishnaswamy, Juan Arguello Escalante
Date: 2024-07-05

Description:
    This project has the goal of analyzing papers published by the IEEE Radiation Effects Data Workshop (REDW)
    With the analyzed results, a concise and accurate database for all components tested can be made
    which would have tremendous value to industry, and community research
"""

from gpt_analysis import gpt_parse
import threading as thread
import xlsxwriter
import os


def main():
    # A list containing the paths of all the papers (from find_papers function)
    paper_list = find_papers()
    # Get the number of papers in the list
    num_papers = len(paper_list)
    # Create an empty list "num_papers" long. Used for multithreading the parsing process
    thread_list = [None] * num_papers
    # List for answers returned from parsing each paper
    answer_matrix = []
    # Loop num_papers times. From 0 -> num_papers-1
    for x in range(num_papers):
        # Hold the path of the current paper
        paper = paper_list[x]
        # Assign the null variable at the index of x to a thread processing the current paper
        # Thread runs the process_paper function and passes the current paper and the answer list as a parameter
        thread_list[x] = thread.Thread(target=process_paper, args=(paper, answer_matrix,))
        # Start the thread
        thread_list[x].start()
    # Loop num_papers times again
    for y in range(num_papers):
        # Join threads -> wait until all threads completed before executing the next code
        thread_list[y].join()
    # Create an excel spreadsheet organizing prompt answers of all papers
    write_to_excel(answer_matrix, paper_list)


def process_paper(paper, answer_matrix):
    # Gather info about paper, such as (author, part no. type, manufacturer, **important** type of testing)
    prelim_results = gpt_parse(assistant_prompt, prompt, paper)
    prelim_results = prelim_results.split("ø")
    # TODO: Get high quality, targeted questions
    if prelim_results[-1] == "TID":
        targeted_questions = ["What type was the radiation source", "What was the total dose",
                              "Were there any failures, if so, when?"]
    elif prelim_results[-1] == "SEE":
        targeted_questions = ["What type was the radiation source", "What the energy of the source",
                              "Were there any failures, if so, when?"]
    else:
        targeted_questions = ["What type was the radiation source",
                              "Were there any failures, if so, when?"]
    targeted_prompt = """Please answer the following questions, as concisely as possible, and with a heavy emphasis on numbers instead of words.
                Use standard text and do not provide citations for each of your answers. 
                Answer each question, and separate the answers with a "ø" character as a delimiter.
                If you are unable to answer the question accurately, provide the answer N/A.\n""" + ". ".join(targeted_questions)
    secondary_results = gpt_parse(assistant_prompt, targeted_prompt, paper)
    secondary_results = secondary_results.split("ø")
    final_results = prelim_results + secondary_results
    print(final_results)
    answer_matrix.append(final_results)


def find_papers():
    # Get the path of the sub-directory where the SMD type of papers are held.
    # Only processing SMD papers right now
    directory = 'Papers_Sorted/SMD'
    # Create a list for the names of the papers
    paperList = []
    # For every paper within directory
    for filename in os.listdir(directory):
        # Append the path of the current paper to the list
        paperList.append(os.path.join(directory, filename))
    # Return the list
    return paperList


def write_to_excel(matrix, papers):
    # Writes the final answers and the names of papers to an excel book
    workbook = xlsxwriter.Workbook('results.xlsx')
    worksheet = workbook.add_worksheet()
    for row in range(len(papers)):
        worksheet.write(row, 0, papers[row])
    for row in range(len(matrix)):
        for col in range(len(matrix[row])):
            worksheet.write(row, col+1, matrix[row][col])
    workbook.close()

# openai.api_key = 'sk-proj' #currently an environment variable, but can be put here

# Setup for the chat_gpt engine and definition of the prompt/questions
name = "Radiation Effects Researcher"
assistant_instructions = "You are a radiation effects reasearcher. Use your knowledge to give very concise and numerical answers to the questions. Please do not give citations."
model = "gpt-4o"
assistant_prompt = [name, assistant_instructions, model]

# author, part no. type, manufacturer, **important** type of testing)
questions = ["What is the first authors name, in the format (J. Doe)", "What is the Part No. or name if that is not available",
             "What is the type of part (eg, switching regulator), if there are multiple part numbers listed, list them all and seperate them with a \"¶\"", "Who is the manufacturer",
             "What type of testing was done: Respond to this question with \"TID\" for Total Ionizing Dose testing, \"SEE\" for heavy ion, proton, laser, or neutron testing, or \"OTHER\" if you are not completely 100% sure"
             ]
joined_questions = ". ".join(questions)

# TODO: possibly make prompt better
prompt="""Please answer the following questions, as concisely as possible, and with a heavy emphasis on numbers instead of words.
            Use standard text and do not provide citations for each of your answers. 
            Answer each question, and separate the answers with a "ø" character as a delimiter.
            If you are unable to answer the question accurately, provide the answer N/A.\n""" + joined_questions
print("\nPROCESSED PAPERS RESPONSES\n")

main()