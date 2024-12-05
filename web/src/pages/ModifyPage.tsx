import "../App.css"
import Nav from "../components/nav-bar/nav-bar"
import { Card } from "@nextui-org/react"


export default function ModifyPage() {
  return (
    <div className="flex flex-col justify-between">
      <Nav />
    <div>Modify Page</div>
    <Card>
      hello
    </Card>
    </div>
  )
}