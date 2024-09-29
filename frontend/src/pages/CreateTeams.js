import { useNavigate } from "react-router-dom";

function CreateTeams() {
    const navigate = useNavigate();

  return (

    <div >
<button onClick={()=> navigate("/Teams")}  className = "button3" > Back </button>

   <h1 id="head">Create Teams</h1>
<div>
<p className="choose"> <div>Select a CSV file </div>
<br></br>
<div><button> Choose a file</button>
</div>
<div>


</div>
     </p>

   
</div>
 

</div>
   
  );
}

export default CreateTeams;
