import React from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";
import fetchMock from 'jest-fetch-mock';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InstructorDashboard from './instructor-dashboard';
import { IconUsers, IconUsersGroup, IconSettings, IconSearch, IconDatabaseImport, IconCirclePlus, IconX, IconCheck } from '@tabler/icons-react';

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

beforeEach(() => {
    fetch.resetMocks();
    global.alert = jest.fn();
   

});


afterEach(() => {
jest.resetAllMocks();
});


describe("InstructorDashboard", ()=>{

    it("has student, teams, and admin in the navigation bar ",()=>{

        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <InstructorDashboard/>
            </MemoryRouter>
            </MantineProvider>
            );

            

            expect(screen.getByTestId(/Student/i)).toBeInTheDocument();
            expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();
            expect(screen.getByTestId(/Admin/i)).toBeInTheDocument();

    });




})