import React from "react";
import {act} from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import PeerEvaluationForm from './peerEvaluationForm';
import { MemoryRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import fetchMock from 'jest-fetch-mock';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TeammatesList from './TeammatesList';



beforeAll(() =>{

    fetchMock.enableMocks();

    global.matchMedia = jest.fn().mockImplementation(query => ({
 
 
        matches: query === "(max-width: 768px)",
        media: query,
        addListener: jest.fn(),
        removeListener: jest.fn()
    })) ;
 
 
 });
 afterAll(() => {
    jest.resetAllMocks();
 })
 
describe('Teammates List', () =>{

    const students = [
        { "id": "345" , "name": "james", "email": "james@cameron.com"},
        {"id": "911" ,"name":"cop", "email": "cop@cop.cop"}
    ];

    const memberships = [
        {   "id": "tm1",
        "team_id": "t1",
        "student_id": "345"
    }
    ];

    const teams = [
        {
            "id": "t1",
            "name": "Team Alpha",
            "course_id": "c1",
            "instructor_id": "qwe@qwe.qwe",
            "max_size": 5
        }
    ];

    const email = "james@cameron.com";
    const selectedTeam = { "id": "t1",  "name": "Team Alpha"}


    beforeEach(() =>{
        fetchMock.mockResponseOnce(JSON.stringify({ hasFeedback: true}));
    })



    it("display list of teammates", async () =>{

        render(
            <MantineProvider>
            <MemoryRouter>
            <TeammatesList
            teams={teams}
            memberships={memberships}
            students={students}
            email={email}
            selectedTeam={selectedTeam}
            />
            </MemoryRouter>
            </MantineProvider>
            );
            await waitFor (() => expect(fetchMock).toHaveBeenCalledTimes(1));

          // await screen.findByText("cop");
    }); 
});
