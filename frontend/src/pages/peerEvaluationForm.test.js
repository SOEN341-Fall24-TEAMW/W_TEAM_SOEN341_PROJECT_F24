import React from "react";
import {act} from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import PeerEvaluationForm from './peerEvaluationForm';
import { MemoryRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import fetchMock from 'jest-fetch-mock';
import { useNavigate, useSearchParams } from 'react-router-dom';



fetchMock.enableMocks();


   beforeEach(() => {
       fetch.resetMocks();
       global.alert = jest.fn();
       jest.spyOn(URLSearchParams.prototype,
           "get").mockImplementation(
               (evaluatorId) =>"12",
               (evaluateeId) =>"34",
               (teamId) => "347"
           );


   });


 beforeAll(() =>{
   global.matchMedia = jest.fn().mockImplementation(query => ({


       matches: false,
       media: query,
       addListener: jest.fn(),
       removeListener: jest.fn()
   })) ;


});


afterEach(() => {
   jest.resetAllMocks();
})


   describe("Peer Evaluation Form" , () =>{


       it("return",  () =>{




           render(
           <MantineProvider>
           <MemoryRouter >
           <PeerEvaluationForm/>
           </MemoryRouter>
           </MantineProvider>
           );


           expect(screen.getByText(/Peer Evaluation Form/i)).toBeInTheDocument();


       });


       //if submit passes
       it("submit pass", async() => {








            render(
                <MantineProvider>
                <MemoryRouter>
                <PeerEvaluationForm/>
                </MemoryRouter>
                </MantineProvider>
                );


                fetchMock.mockResponseOnce(JSON.stringify({message: "success"}));




                const submitbttn = screen.getByTestId("submit");




             const commentconcept = screen.getByPlaceholderText("Add comments on Conceptual Contribution (optional)");
                   expect(commentconcept).toBeInTheDocument();
             fireEvent.change(commentconcept, {target: {value:"amazing"}});
                fireEvent.click(submitbttn);
               
              
             await waitFor (() => expect(fetchMock).toHaveBeenCalledTimes(1));
             await waitFor (() => expect(global.alert).toHaveBeenCalledWith("Evaluation submitted successfully"));
   


        });


        it("submit fails", async() => {




    


           render(
               <MantineProvider>
               <MemoryRouter>
               <PeerEvaluationForm/>
               </MemoryRouter>
               </MantineProvider>
               );
               fetchMock.mockResponseOnce(JSON.stringify({message: ""}));
               const submitbttn = screen.getByTestId("submit");
               fireEvent.click(submitbttn);
             
            await waitFor (() => expect(fetchMock).toHaveBeenCalledTimes(1));
            await waitFor (() => expect(global.alert).toHaveBeenCalledWith("Failed to submit evaluation"));


       });




        it("displays 4 rating criterias" , () =>{
           render(
               <MantineProvider>
               <MemoryRouter>
               <PeerEvaluationForm/>
               </MemoryRouter>
               </MantineProvider>
               );

               const ratingCriteria = screen.getAllByText(/Overall Mark:/);

               expect(ratingCriteria.length).toBe(4);
        });


        it("displays comment boxes for conceptual contribution", () => {
     
           render(
               <MantineProvider>
               <MemoryRouter>
               <PeerEvaluationForm/>
               </MemoryRouter>
               </MantineProvider>
               );
                   const comments = screen.getAllByPlaceholderText("Add comments on Conceptual Contribution (optional)");
                   expect(comments.length).toBe(1);
                   expect(comments).toBeInTheDocument;
        });


        it("displays 7 ratings to choose from for cooperation", () => {

           render(
               <MantineProvider>
               <MemoryRouter>
               <PeerEvaluationForm/>
               </MemoryRouter>
               </MantineProvider>
               );
                   const btn = screen.getAllByRole("rateCooperation");

               expect(btn.length).toBe(7);                

        });


   })
     
