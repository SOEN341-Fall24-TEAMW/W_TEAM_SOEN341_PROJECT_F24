import React, { useRef } from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";




import fetchMock from 'jest-fetch-mock';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InstructorDashboard from './instructor-dashboard';
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
  jest.spyOn(console,'error').mockImplementation(()=>{});




});





afterEach(() => {
jest.resetAllMocks();
jest.restoreAllMocks();
});




const mockuser = {token: "token"};
const mocknavigation = jest.fn();
const mocksetLoggedIn = jest.fn();
describe("InstructorDashboard", ()=>{



  it("has student, and teams in the navigation bar ",()=>{
       render(
          <MantineProvider withGlobalStyles withNormalizeCSS>
          <MemoryRouter >
          <InstructorDashboard user={mockuser} navigation={mocknavigation} setLoggedIn={mocksetLoggedIn} />
          </MemoryRouter>
          </MantineProvider>
          );

          expect(screen.getByTestId(/Student/i)).toBeInTheDocument();
          expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();


  });




  it("teams tab takes you to team page ", async ()=>{

              const mockOrganizations = [
                  {id: "23", name: "concordia"}
              ]
     
      render(
          <MantineProvider withGlobalStyles withNormalizeCSS>
          <MemoryRouter >
          <InstructorDashboard organizations={mockOrganizations} user={mockuser} navigation={mocknavigation} setLoggedIn={mocksetLoggedIn}
            />
          </MemoryRouter>
          </MantineProvider>
          );

          expect(screen.getByTestId(/Student/i)).toBeInTheDocument();
          expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();

          fireEvent.click(screen.getByTestId(/Teams/i));
        await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;

  });


  it("add a new team button to add teams ", async ()=>{

      const mockOrganizations = [
          {id: "23", name: "concordia"}
      ]
render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
  <MemoryRouter >
  <InstructorDashboard organizations={mockOrganizations} user={mockuser} navigation={mocknavigation} setLoggedIn={mocksetLoggedIn}
    />
  </MemoryRouter>
  </MantineProvider>
  );

  expect(screen.getByTestId(/Student/i)).toBeInTheDocument();
  expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();

  fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;

});



it("student tab takes you to student page",()=>{

  render(
      <MantineProvider withGlobalStyles withNormalizeCSS>
      <MemoryRouter >
      <InstructorDashboard setLoggedIn={mocksetLoggedIn} />
      </MemoryRouter>
      </MantineProvider>
      );

      expect(screen.getByTestId(/Student/i)).toBeInTheDocument();
      expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId(/Student/i));
      expect(screen.getByTestId(/stuTitle/i)).toBeInTheDocument();

});

it("button to add a new student",()=>{

  render(
      <MantineProvider withGlobalStyles withNormalizeCSS>
      <MemoryRouter >
      <InstructorDashboard setLoggedIn={mocksetLoggedIn}  />
      </MemoryRouter>
      </MantineProvider>
      );


      expect(screen.getByTestId(/Student/i)).toBeInTheDocument();
      expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId(/Student/i));
      expect(screen.getByTestId(/stuTitle/i)).toBeInTheDocument();


      expect(screen.getByText(/Add a New Student/i)).toBeInTheDocument();


});




it("display create a new team button ", async ()=>{



  const mockOrganizations = [
      {id: "23", name: "concordia"}
  ]




render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);

expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));

await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;


});




it("display import from file button ", async ()=>{


  const mockOrganizations = [
      {id: "23", name: "concordia"}
  ]


render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);



expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));

await waitFor(()=>expect(screen.getByText(/Import from file/i)).toBeInTheDocument())  ;



});




it("display to select an organization after clicking create a new team ", async ()=>{



  const mockOrganizations = [
      {id: "23", name: "concordia"}
  ]


render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);

expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;


fireEvent.click(screen.getByText(/Create New Team/i));

await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;

});


it("can choose from existing organization dropdown after clicking create a new team ", async ()=>{
  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]

render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);

expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();

fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));

await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;

fireEvent.click(screen.getByText(/Create New Team/i));

await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;


await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;

fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;


});




it("can add a new organization after clicking create a new team ", async ()=>{


  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]



render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);


expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();


fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;



fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("New Organization Name")).toBeInTheDocument()) ;


});



it("next button after choosing an organization ", async ()=>{


  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "232", name: "biology "}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);


expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();

fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));

await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;

fireEvent.click(screen.getByText(/Create New Team/i));

await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;

await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;

fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;

fireEvent.click(screen.getByText(/concordia university/i));
await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));


});




it("next button does not work if organization not chosen ", async ()=>{

  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "232", name: "biology "}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);


expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeDisabled()) ;




});
it("can choose an existing course after choosing an organization ", async ()=>{












  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "232", name: "biology "}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);




expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;




});




it("can add a new course after choosing an organization ", async ()=>{



  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "232", name: "biology "}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);

expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Or add a new course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/New course name/i)).toBeInTheDocument()) ;




});
it("can choose from course list after choosing an organization ", async ()=>{



  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);



expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();

fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;




});




it("next button enabled after choosing from course list ", async ()=>{

  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);



expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/biology/i));
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;




});




it("next button disabled if course not choosen ", async ()=>{


  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);

expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();

fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;

fireEvent.click(screen.getByText(/Create New Team/i));

await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;

await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;


fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));


await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;

});








it("team details after choosing a course ", async ()=>{

  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);



expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/biology/i));
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("courseNext"));
await waitFor(()=>expect(screen.getByText(/Enter Team Details/i)).toBeInTheDocument()) ;








});
it("can write team name after choosing a course ", async ()=>{

  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);




expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/biology/i));
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("courseNext"));
await waitFor(()=>expect(screen.getByText(/Enter Team Details/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByText(/Team Name/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Team Name/i)).toBeInTheDocument()) ;




});
it("can set max team size ", async ()=>{



  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);

expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();


fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));

await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;

fireEvent.click(screen.getByText(/Create New Team/i));

await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;


await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;



fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/biology/i));
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("courseNext"));
await waitFor(()=>expect(screen.getByText(/Enter Team Details/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByText(/Max Team Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Max Size/i)).toBeInTheDocument()) ;




});




it("next button enabled after setting max size and writing team name", async ()=>{



  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);


expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();


fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/biology/i));
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("courseNext"));
await waitFor(()=>expect(screen.getByText(/Enter Team Details/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByText(/Team Name/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Team Name/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByText(/Max Team Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Max Size/i)).toBeInTheDocument()) ;
fireEvent.change(screen.getByPlaceholderText(/Team Name/i), {target: {value:"best"}})
fireEvent.change(screen.getByPlaceholderText(/Max Size/i), {target: {value:"5"}})




await waitFor(()=>expect(screen.getByTestId("teamNext")).toBeEnabled()) ;




});




it("next button disabled if team name not set", async ()=>{



  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);


expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/biology/i));
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("courseNext"));
await waitFor(()=>expect(screen.getByText(/Enter Team Details/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByText(/Team Name/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Team Name/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByText(/Max Team Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Max Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByTestId("teamNext")).toBeDisabled()) ;




fireEvent.change(screen.getByPlaceholderText(/Team Name/i), {target: {value:"best"}})




fireEvent.change(screen.getByPlaceholderText(/Max Size/i), {target: {value:"5"}})




await waitFor(()=>expect(screen.getByTestId("teamNext")).toBeEnabled()) ;




});
it("can add students to team after size and team name are set", async ()=>{

  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
  const mockstudents =[
      {organization_id: "23", id:"2345", name:"mada"}
  ]
  const mockmembership =[
      {student_id:"2345"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} students={mockstudents} setLoggedIn={mocksetLoggedIn}
memberships={mockmembership}
/>
</MemoryRouter>
</MantineProvider>
);

expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();

fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));

await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;
fireEvent.click(screen.getByText(/Create New Team/i));
await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;

await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;

fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));

await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/biology/i));
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("courseNext"));
await waitFor(()=>expect(screen.getByText(/Enter Team Details/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByText(/Team Name/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Team Name/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByText(/Max Team Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Max Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByTestId("teamNext")).toBeDisabled()) ;




fireEvent.change(screen.getByPlaceholderText(/Team Name/i), {target: {value:"best"}})




fireEvent.change(screen.getByPlaceholderText(/Max Size/i), {target: {value:"5"}})




await waitFor(()=>expect(screen.getByTestId("teamNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("teamNext"));
await waitFor(()=>expect(screen.getByText(/Add Students to the Team/i)).toBeInTheDocument()) ;


});




it("can select students to team after size and team name are set", async ()=>{



  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
  const mockstudents =[
      {organization_id: "23", id:"2345", name:"lindt"}
  ]
  const mockmembership =[
      {student_id:"23456",id:"23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} students={mockstudents} setLoggedIn={mocksetLoggedIn}
memberships={mockmembership}
/>
</MemoryRouter>
</MantineProvider>
);



expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();




fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));




await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;




fireEvent.click(screen.getByText(/Create New Team/i));




await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/biology/i));
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("courseNext"));
await waitFor(()=>expect(screen.getByText(/Enter Team Details/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByText(/Team Name/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Team Name/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByText(/Max Team Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Max Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByTestId("teamNext")).toBeDisabled()) ;




fireEvent.change(screen.getByPlaceholderText(/Team Name/i), {target: {value:"best"}})




fireEvent.change(screen.getByPlaceholderText(/Max Size/i), {target: {value:"5"}})




await waitFor(()=>expect(screen.getByTestId("teamNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("teamNext"));
await waitFor(()=>expect(screen.getByText(/Add Students to the Team/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByText(/Select Students/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select Students/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select Students/i));
await waitFor(()=>expect(screen.getByText(/lindt/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/lindt/i));


});








it("add students and finish button after students are selected", async ()=>{


  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
  const mockstudents =[
      {organization_id: "23", id:"2345", name:"lindt"}
  ]
  const mockmembership =[
      {student_id:"23456",id:"23"}
  ]
render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} students={mockstudents} setLoggedIn={mocksetLoggedIn}
memberships={mockmembership}
/>
</MemoryRouter>
</MantineProvider>
);


expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();


fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;
fireEvent.click(screen.getByTestId("newteam"));


await waitFor(()=>expect(screen.getByText(/Create New Team/i)).toBeInTheDocument())  ;

fireEvent.click(screen.getByText(/Create New Team/i));

await waitFor(()=>expect(screen.getByText(/Select an organization/i)).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText("Select organization")).toBeInTheDocument()) ;




fireEvent.click(screen.getByPlaceholderText("Select organization"));
await waitFor(()=>expect(screen.getByText(/concordia university/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/concordia university/i));




await waitFor(()=>expect(screen.getByTestId("nextbttn")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("nextbttn"));
await waitFor(()=>expect(screen.getByText(/Choose an existing course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select course/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select course/i));
await waitFor(()=>expect(screen.getByText(/biology/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/biology/i));
await waitFor(()=>expect(screen.getByTestId("courseNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("courseNext"));
await waitFor(()=>expect(screen.getByText(/Enter Team Details/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByText(/Team Name/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Team Name/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByText(/Max Team Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Max Size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByTestId("teamNext")).toBeDisabled()) ;




fireEvent.change(screen.getByPlaceholderText(/Team Name/i), {target: {value:"best"}})




fireEvent.change(screen.getByPlaceholderText(/Max Size/i), {target: {value:"5"}})




await waitFor(()=>expect(screen.getByTestId("teamNext")).toBeEnabled()) ;
fireEvent.click(screen.getByTestId("teamNext"));
await waitFor(()=>expect(screen.getByText(/Add Students to the Team/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByText(/Select Students/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByPlaceholderText(/Select Students/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByPlaceholderText(/Select Students/i));
await waitFor(()=>expect(screen.getByText(/lindt/i)).toBeInTheDocument()) ;
fireEvent.click(screen.getByText(/lindt/i));
await waitFor(()=>expect(screen.getByTestId("finally")).toBeEnabled()) ;




fireEvent.click(screen.getByTestId("finally"));


});








it("team  is displayed", async ()=>{



  const mockOrganizations = [
      {id: "23", name: "concordia university"}
  ]
  const mockcourse = [
      {id: "23", name: "biology", organization_id: "23"}
  ]
  const mockTeamData =[
      {organization_id: "23", course_id: "23"}
  ]
  const mockstudents =[
      {organization_id: "23", id:"23456", name:"lindt"}
  ]
  const mockmembership =[
      {student_id:"23456",id:"23", team_id:"23"}
  ]
  const mockteam =[
      {id:"23",name:"best",max_size: 5, course_id:"23"}
  ]




 const mockrows2 =[
      <Table.Tr key={1}>
        <Table.Td>{"best"}</Table.Td>
        <Table.Td>{"lindt"}</Table.Td>
        <Table.Td>{"No members"}</Table.Td>
        <Table.Td>{"No course"}</Table.Td>
        <Table.Td>{"No organization"}</Table.Td>
      </Table.Tr>
 ]




render(
<MantineProvider withGlobalStyles withNormalizeCSS>
<MemoryRouter >
<InstructorDashboard organizations={mockOrganizations} courses={mockcourse} teamData ={mockTeamData} students={mockstudents}
memberships={mockmembership} team={mockteam}  rows2={mockrows2} user={mockuser} setLoggedIn={mocksetLoggedIn}
/>
</MemoryRouter>
</MantineProvider>
);


expect(screen.getByTestId(/Teams/i)).toBeInTheDocument();


fireEvent.click(screen.getByTestId(/Teams/i));
await waitFor(()=>expect(screen.getByTestId("teamss")).toBeInTheDocument())  ;
await waitFor(()=>expect(screen.getByTestId("newteam")).toBeInTheDocument())  ;




await waitFor(()=>expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByText(/Members/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByText(/Maximum size/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByText(/Course/i)).toBeInTheDocument()) ;
await waitFor(()=>expect(screen.getByText(/Organization/i)).toBeInTheDocument()) ;




await waitFor(()=>expect(screen.getByTestId("tableteam")).toBeInTheDocument())  ;




});


})





