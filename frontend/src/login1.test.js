import React from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import fetchMock from 'jest-fetch-mock';
import { useNavigate } from 'react-router-dom';
import Login from "./login";


fetchMock.enableMocks();

const mockedUseNavigate = jest.fn();

let setRoleError;
let setEmailError;
let setPasswordError;
let setLoggedIn;
let setEmail;
let mockOnButtonClick;


jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

beforeEach(() => {
    setRoleError  = jest.fn();
    setEmailError = jest.fn();
    setPasswordError = jest.fn();
    setLoggedIn = jest.fn();
    setEmail = jest.fn();
    mockOnButtonClick = jest.fn();

    fetch.resetMocks();
    global.alert = jest.fn();
});


beforeAll(() =>{
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), 
        removeListener: jest.fn(), 
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })
 
 });


 afterEach(() => {
    jest.resetAllMocks();
 })

 
 describe("Login" , ()=>{

    it("displays role with placeholder text", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <Login/>
            </MemoryRouter>
            </MantineProvider>
            
        );

        expect(screen.getByText(/Role/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Select a Role/i)).toBeInTheDocument();

    });

    it("options student and instructor in role dropdown", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <Login/>
            </MemoryRouter>
            </MantineProvider>
            
        );

        expect(screen.getByText(/student/i)).toBeInTheDocument();
        expect(screen.getByText(/instructor/i)).toBeInTheDocument();

    });

    it("displays student after student is selected from dropdown",async ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <Login/>
            </MemoryRouter>
            </MantineProvider>
            
        );
            fireEvent.click(screen.getByRole("roleDropdown"));
            fireEvent.click(screen.getByText(/student/i))

        await waitFor(() =>{
            expect(screen.getByRole("roleDropdown")).toHaveValue("student")
        })

    });

    it("displays instructor after instructor is selected from dropdown",async ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <Login/>
            </MemoryRouter>
            </MantineProvider>
            
        );
            fireEvent.click(screen.getByRole("roleDropdown"));
            fireEvent.click(screen.getByText(/instructor/i))

        await waitFor(() =>{
            expect(screen.getByRole("roleDropdown")).toHaveValue("instructor")
        });

    });

    it("displays to enter email address with placeholder text", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <Login/>
            </MemoryRouter>
            </MantineProvider>
            
        );

        expect(screen.getByLabelText(/Enter your email address:/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email Adress/i)).toBeInTheDocument();

    });

    it("once email entered placeholder value changes", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <Login/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        fireEvent.click(screen.getByRole("email"));
       
        fireEvent.change(screen.getByPlaceholderText(/Email Adress/i),{ target: {value: 'qwe@qwe.qwe'},});
        expect(screen.getByPlaceholderText(/Email Adress/i).value).toBe('qwe@qwe.qwe');

    });



    it("displays to enter password with placeholder text", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <Login/>
            </MemoryRouter>
            </MantineProvider>
            
        );

        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();


    });


    it("once password entered type changes", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <Login/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        fireEvent.click(screen.getByRole("password"));
       
        fireEvent.change(screen.getByPlaceholderText(/Password/i),{ target: {value: '123456'},});
        expect(screen.getByPlaceholderText(/Password/i).value).toBe('123456');

    });


    it("display login button", ()=>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <Login/>
            </MemoryRouter>
            </MantineProvider>
            
        );
        expect(screen.getByText(/Login/i)).toBeInTheDocument();

    });

    it("alerts if email if role is not selected", async  ()=>{


        render(
            <MantineProvider>
            <MemoryRouter>
            <Login 
        
            onButtonClick = {mockOnButtonClick}
             />
            </MemoryRouter>
            </MantineProvider>
            
        );



        fireEvent.click(screen.getByText(/Login/i));

        expect(mockOnButtonClick).toHaveBeenCalledTimes(1);
        

        
    });


 });