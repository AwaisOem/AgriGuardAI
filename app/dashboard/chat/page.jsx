"use client"
import {
    CornerDownLeft,
  } from "lucide-react"
  
  import { Button } from "@/components/ui/button"
  import { Label } from "@/components/ui/label"
  import { Textarea } from "@/components/ui/textarea"
  import {
    TooltipProvider,
  } from "@/components/ui/tooltip"
  import axios from "axios"
import { useState,useEffect,useRef } from "react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RocketIcon } from "lucide-react"

export default function Page() {
    const [answer, setAnswer] = useState("");
    const [conversation, setConversation] = useState([<Instructions key={"instruction"} />])

   

    const handleAnswerSubmit = async () =>{
        if(answer=="")return;
        setConversation(p=>[...p, <AnswerBubble key={crypto.randomUUID()} text={answer} />])
        setAnswer("");

        try{
            let response =await axios.post(`/api/chat`,{prompt :answer});
            console.log(response.data)
            setConversation(p=>[...p, <QuestionBubble key={crypto.randomUUID()} text={response.data} />])
        }catch(e){
            setConversation(p=>[...p, <QuestionBubble key={crypto.randomUUID()} text={"Error on server side, try again"} />])
        }

    }


    


    const messagesEndRef = useRef(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(() => {
      scrollToBottom();
    }, [conversation]);


    return (
    <TooltipProvider>
      <div className="grid h-screen w-full">
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-0 bg-slate-900 px-4 justify-between">
          </header>
          <main className="grid flex-1 gap-4 overflow-auto p-4">
            <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-slate-800 p-4 lg:col-span-2">
              <div className="flex-grow overflow-y-auto h-[100px] mt-6 pb-4 scrollbar-hide space-y-5 ">
                  {conversation}
                  <div ref={messagesEndRef} />
              </div>
              <form
                className="relative overflow-hidden rounded-lg bg-slate-700 border-0 text-white" onSubmit={e=>{e.preventDefault();handleAnswerSubmit();}} x-chunk="dashboard-03-chunk-1"
              >
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={answer}
                  onKeyDown={
                    (event) => {
                      if (event.key === 'Enter' && answer.trim())
                          handleAnswerSubmit();
                    }
                  }
                  onChange={e=>setAnswer(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-12 resize-none border-0 bg-slate-700 p-3 shadow-none focus-visible:ring-0 outline-none focus-visible:ring-offset-0"
                />
                <div className="flex items-center p-3 pt-0">
                  <Button type="submit" size="sm" className="ml-auto gap-1.5 bg-white text-black hover:bg-white/90 hover:text-black">
                    Ask Question
                    <CornerDownLeft className="size-3.5" />
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>

    )
}


function QuestionBubble({text}){
  return (
  <li className="flex gap-x-2 sm:gap-x-4">
    <div className="bg-white text-black border border-gray-200 rounded-lg p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
      {text}
    </div>
  </li>
)
}

function AnswerBubble({text}){
  return (
  <li className="max-w-2xl ms-auto flex justify-end gap-x-2 sm:gap-x-4">
    <div className="grow text-end space-y-3">
    <div className="inline-block bg-black rounded-lg p-4 shadow-sm">
        <p className="text-sm text-white">{text}</p>
    </div>
    </div>
</li>)
}

function Instructions(){
    return (
          <Alert className="bg-slate-700 border-0 text-white flex justify-between items">
            <div className="flex flex-col">
                <div className="flex gap-2">
                    <RocketIcon className="h-4 w-4" color="white" />
                    <AlertTitle>Instructions!</AlertTitle>
                </div>
                <AlertDescription>
                <ul className="list-disc px-8">
                    <li>Ask Your Question. Type your query about farming practices or crop issues in the chatbox and hit send.</li>
                    <li>Provide Details. Include specific information like crop type and location for more accurate advice.</li>
                    <li>Receive Tailored Advice. Review the AI’s responses, which are customized based on your input and data.</li>
                    <li>Implement Suggestions. Apply the recommended actions and strategies to improve your farming practices.</li>
                </ul>
                </AlertDescription>
            </div>
            <Link href="/dashboard">
              <Button
                className="ml-auto gap-1.5 text-sm bg-white text-black hover:bg-white/90 hover:text-black"
              >
                {"<- Go Back"}
              </Button>
            </Link>
          </Alert>
        )
  }
