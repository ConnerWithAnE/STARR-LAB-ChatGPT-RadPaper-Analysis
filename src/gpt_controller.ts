import OpenAI from "openai"
import { GPTModel } from "./enums";
import { FileObject } from "openai/resources";

class GPTController {

    private client: OpenAI;
    private model: GPTModel;

constructor(model: GPTModel) {
    this.client = new OpenAI({
        apiKey: process.env.OPEN_API_KEY, // This is the default and can be omitted
      });
    this.model = model;
}

    async StreamReq() {
        const stream = await this.client.chat.completions.create({
            model: this.model,
            messages: [{ role: 'user', content: 'Say this is a test' }],
            stream: true,
          });
          for await (const chunk of stream) {
            process.stdout.write(chunk.choices[0]?.delta?.content || '');
          }
    }




        
    



}