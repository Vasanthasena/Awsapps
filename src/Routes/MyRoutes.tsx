import { Routes, Route } from "react-router-dom";
import HomePage from "../Pages/Crud-Project/HomePage";
import Crud from "../Pages/Crud-Project/Crud";
import Getevent from "../Pages/Crud-Project/Getevent";

function Routers(){
return(
    <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/crud-put" element={<Crud/>}/>
        <Route  path="/crud-get" element={<Getevent/>}/>
    </Routes>
)


}
export default Routers;