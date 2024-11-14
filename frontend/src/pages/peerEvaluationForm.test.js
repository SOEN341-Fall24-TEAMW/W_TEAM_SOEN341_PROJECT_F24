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


       it("returns",  () =>{

           render(
           <MantineProvider>
           <MemoryRouter >
           <PeerEvaluationForm/>
           </MemoryRouter>
           </MantineProvider>
           );


           expect(screen.getByText(/Peer Evaluation Form/i)).toBeInTheDocument();


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


        it("displays comment boxes for cooperation dimension", () => {
     
           render(
               <MantineProvider>
               <MemoryRouter>
               <PeerEvaluationForm/>
               </MemoryRouter>
               </MantineProvider>
               );
                   const comments = screen.getAllByPlaceholderText("Add comments on cooperation (optional)");
                   expect(comments.length).toBe(1);
                   expect(screen.getByText(/1. Cooperation/i)).toBeInTheDocument();

                   expect(comments).toBeInTheDocument;
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

                    expect(screen.getByText(/2. Conceptual Contribution/i)).toBeInTheDocument();

                    expect(comments).toBeInTheDocument;
         });


         it("displays comment boxes for practical contribution", () => {
     
            render(
                <MantineProvider>
                <MemoryRouter>
                <PeerEvaluationForm/>
                </MemoryRouter>
                </MantineProvider>
                );
                    const comments = screen.getAllByPlaceholderText("Add comments on practical contribution (optional)");
                    expect(comments.length).toBe(1);

                    expect(screen.getByText(/3. Practical Contribution/i)).toBeInTheDocument();

                    expect(comments).toBeInTheDocument;
         });

         it("displays comment boxes for work ethic", () => {
     
            render(
                <MantineProvider>
                <MemoryRouter>
                <PeerEvaluationForm/>
                </MemoryRouter>
                </MantineProvider>
                );
                    const comments = screen.getAllByPlaceholderText("Add comments on work ethic (optional)");
                    expect(comments.length).toBe(1);

                    expect(screen.getByText(/4. Work Ethic/i)).toBeInTheDocument();

                    expect(comments).toBeInTheDocument;
         });

        it("displays 7 ratings to choose from for cooperation dimension", () => {

           render(
               <MantineProvider>
               <MemoryRouter>
               <PeerEvaluationForm/>
               </MemoryRouter>
               </MantineProvider>
               );
                   const btn = screen.getAllByRole("rateCooperation");

               expect(btn.length).toBe(7);                
               expect()

        });

        it("displays 7 ratings to choose from for conceptual contribution", () => {

            render(
                <MantineProvider>
                <MemoryRouter>
                <PeerEvaluationForm/>
                </MemoryRouter>
                </MantineProvider>
                );
                    const btn = screen.getAllByRole("rateConceptual");
 
                expect(btn.length).toBe(7);                
 
         });

         it("displays 7 ratings to choose from for practical contribution", () => {

            render(
                <MantineProvider>
                <MemoryRouter>
                <PeerEvaluationForm/>
                </MemoryRouter>
                </MantineProvider>
                );
                    const btn = screen.getAllByRole("ratePractical");
 
                expect(btn.length).toBe(7);                
 
         });

         it("displays 7 ratings to choose from for work ethic", () => {

            render(
                <MantineProvider>
                <MemoryRouter>
                <PeerEvaluationForm/>
                </MemoryRouter>
                </MantineProvider>
                );
                    const btn = screen.getAllByRole("rateWorkEthic");
 
                expect(btn.length).toBe(7);                
 
         });

         it("submit disabled", async() => {


            const mockisFormComplete=jest.fn();
            mockisFormComplete.mockReturnValue(true);
    
            let mockisSubmitting = true;
           render(
               <MantineProvider>
               <MemoryRouter>
               <PeerEvaluationForm isSubmitting = {mockisSubmitting}  isFormComplete = {mockisFormComplete} />
               </MemoryRouter>
               </MantineProvider>
               );
               fetchMock.mockResponseOnce(JSON.stringify({message: ""}));
               const submitbttn = screen.getByTestId("submit");
               fireEvent.click(submitbttn);
            
 
 
            expect(mockisFormComplete()).toBe(true);
            expect(mockisSubmitting).toBe(true);
   
            await waitFor(()=>expect(submitbttn).toBeDisabled()) ;
       });
 


   })
     
