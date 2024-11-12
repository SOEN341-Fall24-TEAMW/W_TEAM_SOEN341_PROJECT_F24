import React, { useRef } from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";

import fetchMock from 'jest-fetch-mock';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TeammatesList from './TeammatesList';
import { IconUsers, IconUsersGroup, IconSettings, IconSearch, IconDatabaseImport, IconCirclePlus, IconX, IconCheck } from '@tabler/icons-react';
import {  Table } from '@mantine/core';

import { Space, Button, TextInput, Select, Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

global.fetch = jest.fn();

jest.mock('@mantine/hooks', () => {
   
    const actualHooks = jest.requireActual('@mantine/hooks');
    return {
        ...actualHooks,
    useMediaQuery: jest.fn(() => [true]),

};
});

fetchMock.enableMocks();

global.HTMLElement.prototype.scrollIntoView = jest.fn();

beforeEach(() => {
    fetch.resetMocks();
    global.alert = jest.fn();

 
});


afterEach(() => {
jest.resetAllMocks();
});

describe("TeammatesList", ()=>{

    const mockselectedTeam =[
        {name:"poly"}
    ]
    const mockstudents = [
        {email: "abc.abc@gmail.com"}
    ]
    const mockemail = "abc.abc@gmail.com";

it("returns Teammates", ()=>{

    render(
        <MantineProvider withGlobalStyles withNormalizeCSS>
        <MemoryRouter >
        <TeammatesList selectedTeam={mockselectedTeam} students={mockstudents}
        email={mockemail} />
        </MemoryRouter>
        </MantineProvider>
        );

        expect(screen.getByText(/Teammates/i)).toBeInTheDocument();

});


})