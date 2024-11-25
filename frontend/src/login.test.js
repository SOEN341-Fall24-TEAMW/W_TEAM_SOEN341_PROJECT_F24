import React from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole, getByPlaceholderText, getByText } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import fetchMock from 'jest-fetch-mock';
import { useNavigate } from 'react-router-dom';
import Login from "./login";


fetchMock.enableMocks();


const mockedUseNavigate = jest.fn();

global.localStorage = {
    setItem: jest.fn()
};
let setRoleError;
let setEmailError;
let setPasswordError;
const mocksetLoggedIn = jest.fn();
const mocksetEmail = jest.fn();

let mockOnButtonClick;
let setPassword;
let setRole;

let mockcheckAccountExists;
let mocklogIn;



jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

beforeEach(() => {
    fetch.resetMocks();

    setRoleError  = jest.fn();
    setEmailError = jest.fn();
    setPasswordError = jest.fn();

    mockOnButtonClick = jest.fn();
    setPassword = jest.fn();
    setRole = jest.fn();

    mockcheckAccountExists = jest.fn();
    mocklogIn = jest.fn();

    jest.clearAllMocks();
    global.alert = jest.fn();
    Element.prototype.scrollIntoView = jest.fn();

    jest.spyOn(global,'alert');
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
    global.alert.mockRestore();
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

 });