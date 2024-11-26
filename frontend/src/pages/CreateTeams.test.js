import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import fetchMock from 'jest-fetch-mock';
import CreateTeams from "./CreateTeams";


fetchMock.enableMocks();


beforeEach(() => {
    fetch.resetMocks();
    global.alert = jest.fn();
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


describe(" CreateTeams ", () =>{

    it("returns",() =>{



        render(
            <MantineProvider>
            <MemoryRouter >
            <CreateTeams/>
            </MemoryRouter>
            </MantineProvider>
            );
 
 
            expect(screen.getByText(/Create Teams/i)).toBeInTheDocument();
 
 
        });
 
})