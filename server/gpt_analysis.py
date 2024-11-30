from openai import OpenAI
import time

def gpt_parse(assistant_prompt, prompt, paper):
    client = OpenAI()

    assistant = client.beta.assistants.create(
        name=assistant_prompt[0],
        instructions=assistant_prompt[1],
        model=assistant_prompt[2],
        tools=[{"type": "file_search"}],
        temperature=.1
    )

    # Upload the user provided file to OpenAI
    message_file = client.files.create(
        file=open(paper, "rb"),
        purpose="assistants"
    )

    # Create a thread and attach the file to the message
    thread = client.beta.threads.create(
        messages=[
            {
                "role": "user",
                "content": prompt,

                # Attach the new file to the message.
                "attachments": [
                    {"file_id": message_file.id, "tools": [{"type": "file_search"}]}
                ],
            }
        ]
    )



    # Then, we use the stream SDK helper
    # with the EventHandler class to create the Run
    # and stream the response.

    with client.beta.threads.runs.stream(
            thread_id=thread.id,
            assistant_id=assistant.id,
    ) as stream:
        stream.until_done()

    messages = client.beta.threads.messages.list(
        thread_id=thread.id)

    while messages.data[0].role == 'user':
        time.sleep(1)
        messages = client.beta.threads.messages.list(
            thread_id=thread.id)
        return "user" #terrible workaround that does not work... not sure why program sometimes returns message from user
                        #pls fix


    return (messages.data[0].content[0].text.value)