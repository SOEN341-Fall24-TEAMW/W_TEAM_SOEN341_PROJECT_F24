import React from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";
import fetchMock from 'jest-fetch-mock';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CreateNewAccount from './create-new-account';

import { Space, Button, TextInput, Select, Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

jest.mock('@mantine/hooks', () => {
   
    const actualHooks = jest.requireActual('@mantine/hooks');
    return {
        ...actualHooks,
    useMediaQuery: jest.fn(() => [true]),

};
});

fetchMock.enableMocks();

global.HTMLElement.prototype.scrollIntoView = jest.fn();

const mockorganization_list = [{id: "344", name: "Concordia University"},
{id:"431", name: "mcgill university"}]

   beforeEach(() => {
       fetch.resetMocks();
       global.alert = jest.fn();
      

   });


afterEach(() => {
   jest.resetAllMocks();
});





describe("Create new account" , ()=>{

    it("displays role", ()=>{


        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            );

     
            expect(screen.getByText(/Role/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Select a Role/i)).toBeInTheDocument();

 
    }); 
    it("displays student after student is selected from role dropdown",async ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            
        );
            fireEvent.click(screen.getByRole(/roles/i));
            fireEvent.click(screen.getByText(/student/i))

        await waitFor(() =>{
            expect(screen.getByRole(/roles/i)).toHaveValue("student")
        })

    });

    it("displays instructor after instructor is selected from role dropdown",async ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        fireEvent.click(screen.getByRole(/roles/i));
        fireEvent.click(screen.getByText(/instructor/i))

        await waitFor(() =>{
            expect(screen.getByRole("roles")).toHaveValue("instructor")
        });

    });




    it("displays student id if role is student",async ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            
        );
            fireEvent.click(screen.getByText(/Role/i));
            fireEvent.click(screen.getByText(/student/i));

        await waitFor(() =>{
            expect(screen.getByText(/Enter your student ID:/i)).toBeInTheDocument();
        })

    });
    it("does not display student id if role is instructor",async ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            
        );
            fireEvent.click(screen.getByText(/Role/i));
            fireEvent.click(screen.getByText(/instructor/i));

        await waitFor(() =>{
            expect(screen.queryByLabelText(/Enter your student ID:/i)).toBeNull();
        })

    });



    it("displays first name", ()=>{


        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Enter your first name:/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();




    });


    it("after first name entered placeholder value changes", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        expect(screen.getByText(/Enter your first name:/i)).toBeInTheDocument();
       
        fireEvent.change(screen.getByPlaceholderText(/First Name/i),{ target: {value: 'rome'},});
        expect(screen.getByPlaceholderText(/First Name/i).value).toBe('rome');

    });


    it("displays last name", ()=>{


        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Enter your last name:/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();

    });


    it("after last name entered placeholder value changes", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        expect(screen.getByText(/Enter your last name:/i)).toBeInTheDocument();
       
        fireEvent.change(screen.getByPlaceholderText(/Last Name/i),{ target: {value: 'naom'},});
        expect(screen.getByPlaceholderText(/Last Name/i).value).toBe('naom');

    });


    it("displays email address", ()=>{


        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Enter your email address:/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Email Adress/i)).toBeInTheDocument();

    });

    it("after email entered placeholder value changes", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        expect(screen.getByText(/Enter your email address:/i)).toBeInTheDocument();
       
        fireEvent.change(screen.getByPlaceholderText(/Email Adress/i),{ target: {value: 'qwe@qwe.qwe'},});
        expect(screen.getByPlaceholderText(/Email Adress/i).value).toBe('qwe@qwe.qwe');

    });


    it("displays password", ()=>{


        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Password/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();

    });


    it("after password entered placeholder value changes", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        expect(screen.getByText(/Password/i)).toBeInTheDocument();
       
        fireEvent.change(screen.getByPlaceholderText(/Password/i),{ target: {value: '12345'},});
        expect(screen.getByPlaceholderText(/Password/i).value).toBe('12345');

    });


    it("displays to choose an existing organization", ()=>{


        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Choose an existing organization/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Select Organization/i)).toBeInTheDocument();

    });

    it("options from organization list in  existing organization dropdown", ()=>{

        const mockorganization_list = [{id: "344", name: "concordia"},
    {id:"431", name: "mcgill"}]
        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount organization_list = {mockorganization_list}/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        expect(screen.getByText(/Choose an existing organization/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Choose an existing organization/i))

        expect(screen.getByText(/concordia/i)).toBeInTheDocument();
        expect(screen.getByText(/McGill/i)).toBeInTheDocument();

    });

    it("an organization can be selected", async ()=>{

     
        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount organization_list = {mockorganization_list}/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        expect(screen.getByText(/Choose an existing organization/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Choose an existing organization/i))

        expect(screen.getByText(/concordia university/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/concordia university/i))
        await waitFor(() =>{
            expect(screen.getByRole("orgDropdown")).toHaveValue("Concordia University")
        });

    });

    it("options student and instructor in role dropdown", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        expect(screen.getByText(/Role/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Role/i));
        expect(screen.getByText(/student/i)).toBeInTheDocument();
        expect(screen.getByText(/instructor/i)).toBeInTheDocument();

    });

    it("displays create account button", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <CreateNewAccount/>
            </MemoryRouter>
            </MantineProvider>
            

        );      
          expect(screen.getByText(/Create Account/i)).toBeInTheDocument();

    }  );

it("invalid email", async()=>{


    const mockonButtonClick = jest.fn();
    const mockemail = "";
    const mockAlert = jest.spyOn(window,'alert').mockImplementation(()=>{});


    render(
        <MantineProvider>
        <MemoryRouter>
        <CreateNewAccount onButtonClick={mockonButtonClick} email={mockemail}  />
        </MemoryRouter>
        </MantineProvider>
       


    );     
        fireEvent.click(screen.getByText(/Create Account/i));

      expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
     
      await waitFor(()=>expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument())


}  );


it("invalid role", async()=>{


    const mockonButtonClick = jest.fn();
   const mockrole = "student";
   const  mockid = "";
    const mockAlert = jest.spyOn(window,'alert').mockImplementation(()=>{});


    render(
        <MantineProvider>
        <MemoryRouter>
        <CreateNewAccount onButtonClick={mockonButtonClick} role={mockrole} id={mockid}  />
        </MemoryRouter>
        </MantineProvider>
    
    );     

      expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
      expect(screen.getByRole(/roles/i)).toBeInTheDocument();
     
      fireEvent.click(screen.getByRole(/roles/i));
      expect(screen.getByText(/student/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/student/i));
               
                fireEvent.click(screen.getByText(/Create Account/i));


      await waitFor(()=>expect(screen.getByText(/Please enter your student Id/i)).toBeInTheDocument())


}  );




it("invalid first name", async()=>{


    const mockonButtonClick = jest.fn();
   const mockfirstName = "";
    const mockAlert = jest.spyOn(window,'alert').mockImplementation(()=>{});


    render(
        <MantineProvider>
        <MemoryRouter>
        <CreateNewAccount onButtonClick={mockonButtonClick} firstName={mockfirstName} />
        </MemoryRouter>
        </MantineProvider>
    
    );     


      expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  
               
      fireEvent.click(screen.getByText(/Create Account/i));


      await waitFor(()=>expect(screen.getByText(/Please enter your first name/i)).toBeInTheDocument())


}  );


it("invalid last name", async()=>{


    const mockonButtonClick = jest.fn();
   const mocklastName = "";
    const mockAlert = jest.spyOn(window,'alert').mockImplementation(()=>{});


    render(
        <MantineProvider>
        <MemoryRouter>
        <CreateNewAccount onButtonClick={mockonButtonClick} lastName={mocklastName} />
        </MemoryRouter>
        </MantineProvider>
       
    );     
      expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  
               
                fireEvent.click(screen.getByText(/Create Account/i));


      await waitFor(()=>expect(screen.getByText(/Please enter your last name/i)).toBeInTheDocument())


}  );


it("invalid password", async()=>{


    const mockonButtonClick = jest.fn();
   const mockpassword = "";
    const mockAlert = jest.spyOn(window,'alert').mockImplementation(()=>{});


    render(
        <MantineProvider>
        <MemoryRouter>
        <CreateNewAccount onButtonClick={mockonButtonClick} password={mockpassword} />
        </MemoryRouter>
           </MantineProvider>
          


       );     


         expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
     
                  
                   fireEvent.click(screen.getByText(/Create Account/i));


         await waitFor(()=>expect(screen.getByText(/The password must be 8 characters or longer/i)).toBeInTheDocument())


   }  );


   it("invalid organization", async()=>{


       const mockonButtonClick = jest.fn();
      const mockorganizationId = "";
       const mockAlert = jest.spyOn(window,'alert').mockImplementation(()=>{});


       render(
           <MantineProvider>
           <MemoryRouter>
           <CreateNewAccount onButtonClick={mockonButtonClick} organizationId={mockorganizationId} />
           </MemoryRouter>
           </MantineProvider>
          
       );     
         expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
     
         fireEvent.click(screen.getByText(/Create Account/i));

         await waitFor(()=>expect(screen.getByText(/Please select an organization/i)).toBeInTheDocument())


   }  );



});