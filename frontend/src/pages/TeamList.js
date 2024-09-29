
import { useNavigate } from "react-router-dom";


function TeamList() {

  const navigate = useNavigate();

 return (

  <div>
   { /* going to back to teams page */}
   <button onClick={()=> navigate("/Teams")}  className = "button3" > Back </button>


   <h1 id="head1" >Team List</h1>
 
<div id="teamList">


</div>


</div>);
}
 
export default TeamList;

