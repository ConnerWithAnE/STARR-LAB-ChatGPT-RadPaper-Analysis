"""
Description:
This file serves the purpose of sorting IEEE workshop papers into distinct categories
to use targeted analysis.
"""

from gpt_analysis import gpt_parse
import threading as thread
import shutil
import time
import os


def main():
    # A list containing the paths of all the papers (from find_papers function)
    paper_list = find_papers()
    # Get the number of papers in the list
    num_papers = len(paper_list)
    # Create an empty list "num_papers" long. Used for multithreading the sorting process
    thread_list = [None] * num_papers
    # Create the directory "Papers_Sorted" if it doesn't already exist. Used as the place where sorted papers will go
    if not os.path.exists("Papers_Sorted"):
        os.makedirs("Papers_Sorted")
    # Loop num_papers times. From 0 -> num_papers-1
    for x in range(num_papers):
        # Hold the path of the current paper
        cur_paper = paper_list[x]
        # Assign the null variable at the index of x to a thread processing the current paper
        # Thread runs the sort_paper function and passes the current paper as a parameter
        thread_list[x] = thread.Thread(target=sort_papers, args=(cur_paper,))
        # Start the thread
        thread_list[x].start()
    # Loop num_papers times again
    for y in range(num_papers):
        # Join threads -> wait until all threads completed before executing the next code
        thread_list[y].join()


def sort_papers(paper):
    # Variable which holds the type of paper passed into the function
    # The paper is parsed using the GPT engine and answers the prompt below
    paper_type = gpt_parse(assistant_prompt, prompt, paper)
    # Print paper type to console
    print(paper_type)
    #
    time.sleep(2)
    # Variable holding the name of the directory where sorted papers go
    baseFolder = 'Papers_Sorted'
    # If the paper is of type "LAB", then a sub-directory within Papers_Sorted will be created named LAB
    #       (for papers of these types) if this sub-directory isn't already there
    # The paper is then copied to that sub-directory and the same process applies to the other 4 paper types
    if paper_type == "LAB":
        if not os.path.exists(baseFolder + "/LAB/"):
            os.makedirs(baseFolder + "/LAB/")
        shutil.copy(paper, "Papers_Sorted/LAB/" + os.path.basename(paper))
    elif paper_type == "TST":
        if not os.path.exists(baseFolder + "/TST/"):
            os.makedirs(baseFolder + "/TST/")
        shutil.copy(paper, "Papers_Sorted/TST/" + os.path.basename(paper))
    elif paper_type == "PHE":
        if not os.path.exists(baseFolder + "/PHE/"):
            os.makedirs(baseFolder + "/PHE/")
        shutil.copy(paper, "Papers_Sorted/PHE/" + os.path.basename(paper))
    elif paper_type == "CMP":
        if not os.path.exists(baseFolder + "/CMP/"):
            os.makedirs(baseFolder + "/CMP/")
        shutil.copy(paper, "Papers_Sorted/CMP/" + os.path.basename(paper))
    elif paper_type == "SMD":
        if not os.path.exists(baseFolder + "/SMD/"):
            os.makedirs(baseFolder + "/SMD/")
        shutil.copy(paper, "Papers_Sorted/SMD/" + os.path.basename(paper))
    else:
        print("user")


def find_papers():
    # Get the path of directory of where the unsorted papers are held
    directory = 'ExamplePapers'
    # Create a list for the names of the papers
    paperList = []
    # For every paper within directory
    for filename in os.listdir(directory):
        # Append the path of the current paper to the list
        paperList.append(os.path.join(directory, filename))
    # Return the list
    return paperList


# openai.api_key = 'sk-proj' (currently an environment variable, but can be put here)

# Setup for the chat_gpt engine and definition of the prompt/questions
name = "Radiation Effects Researcher"
assistant_instructions = "You are a radiation effects reasearcher. Use your knowledge to categorize this paper into one of the five categories. Only respond with one of the five three letter categories. Please do not give citations."
model = "gpt-4o-mini"
assistant_prompt = [name, assistant_instructions, model]

# author, part no. type, manufacturer, **important** type of testing)
questions = """There are five types of papers: 
            The first are \"Laboratory Capabilities/Facility Equipment/Simulator\", which detail the capacities of a location, or university for use in research.
            The second are \"Testing Methods\", which detail specific methods of testing, without any devices being tested in the paper.
            The third are \"Phenomenons/Theory Papers_Sorted\", which detail theories or phenomenons that occur on a wide variety of devices, without doing specific testing on a device.
            The fourth are \"Compendiums\", which are collections of concise but detailed data on a large variety of devices. The devices must have their part numbers listed to be in this category.
            The fifth are \"Single/Multiple Device Testing\", which are papers that test one or more devices with one or more types of radiation. The device must have a part number to be in this category.
            In the same order, respond with \"LAB\", \"TST\", \"PHE\", \"CMP\", or \"SMD\", for the category that the paper best fits."""

# TODO: possibly make prompt better
prompt = """Please answer the following question, as concisely as possible, with a single word answer as outlined in the question.
            Classify this paper into one of the following categories: """ + questions + """
            Use standard text and do not provide citations for each of your answer.
            Answer the question with the keyword for one of the 5 papers.
            If you are unable to answer the question accurately, provide the answer N/A."""
print("CLASSIFYING PAPER TYPE\n")

if __name__ == "main":
    main()