
import { useNavigate } from "react-router-dom";

        function Teams() {
    const navigate = useNavigate();
  return (
  <div >
     <h1 id="team">Teams</h1>

 <div className = "button-container">

        <button onClick={()=> navigate("/CreateTeams")} className = "button" >Create Team</button>
     
         <button onClick={()=> navigate("/TeamList")}  className = "button2">Team List</button>
    
      
     
     </div>

</div>
   
  );
}

export default Teams;
