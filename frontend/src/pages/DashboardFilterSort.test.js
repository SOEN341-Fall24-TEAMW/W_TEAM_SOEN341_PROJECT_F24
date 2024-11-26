import React, { useRef } from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";




import fetchMock from 'jest-fetch-mock';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardSort from './DashboardFilterSort';
import { IconUsers, IconUsersGroup, IconSettings, IconSearch, IconDatabaseImport, IconCirclePlus, IconX, IconCheck } from '@tabler/icons-react';
import {  Table } from '@mantine/core';




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
  jest.restoreAllMocks();
  });
  
  
  describe("Sorting", ()=>{

    it(" display Sort by and Sort order ",()=>{

        const mockonChange = jest.fn();
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <DashboardSort  onChange={mockonChange} />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Sort by/i)).toBeInTheDocument();
            expect(screen.getByText(/Sort order/i)).toBeInTheDocument();



    });



    it(" calls onChange to sort name ", ()=>{

        const mockonChange = jest.fn();
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <DashboardSort  onChange={mockonChange} />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Sort by/i).value).toBe(undefined);
            expect(screen.getByText(/Sort order/i).value).toBe(undefined);
            fireEvent.click(screen.getByText(/Sort by/i));
            fireEvent.click(screen.getByRole('option',{name: 'Name'}));
            fireEvent.click(screen.getByText(/Sort order/i));
            fireEvent.click(screen.getByRole('option',{name: 'Ascending'}));
            expect(mockonChange).toHaveBeenCalledTimes(3);
            expect(mockonChange).toHaveBeenCalledWith({sortBy: "name", sortOrder: "asc"})

    });

    it(" calls onChange to sort ID ", ()=>{

        const mockonChange = jest.fn();
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <DashboardSort  onChange={mockonChange} />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Sort by/i).value).toBe(undefined);
            expect(screen.getByText(/Sort order/i).value).toBe(undefined);
            fireEvent.click(screen.getByText(/Sort by/i));
            fireEvent.click(screen.getByRole('option',{name: 'ID'}));
            fireEvent.click(screen.getByText(/Sort order/i));
            fireEvent.click(screen.getByRole('option',{name: 'Descending'}));
            expect(mockonChange).toHaveBeenCalledTimes(3);
            expect(mockonChange).toHaveBeenCalledWith({sortBy: "id", sortOrder: "desc"})


    });

    it(" calls onChange to sort email ", ()=>{

        const mockonChange = jest.fn();
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <DashboardSort  onChange={mockonChange} />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Sort by/i).value).toBe(undefined);
            expect(screen.getByText(/Sort order/i).value).toBe(undefined);
            fireEvent.click(screen.getByText(/Sort by/i));
            fireEvent.click(screen.getByRole('option',{name: 'Email'}));
            fireEvent.click(screen.getByText(/Sort order/i));
            fireEvent.click(screen.getByRole('option',{name: 'Ascending'}));
            expect(mockonChange).toHaveBeenCalledTimes(3);
            expect(mockonChange).toHaveBeenCalledWith({sortBy: "email", sortOrder: "asc"})


    });



    it(" calls onChange with default ", ()=>{

        const mockonChange = jest.fn();
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <DashboardSort  onChange={mockonChange} />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Sort by/i).value).toBe(undefined);
            expect(screen.getByText(/Sort order/i).value).toBe(undefined);
           
            expect(mockonChange).toHaveBeenCalledTimes(1);
            expect(mockonChange).toHaveBeenCalledWith({sortBy: "", sortOrder: "asc"})


    });


  })