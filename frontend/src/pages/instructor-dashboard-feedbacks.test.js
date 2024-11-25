import React from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@testing-library/jest-dom";
import fetchMock from 'jest-fetch-mock';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InstructorFeedbackTab from './instructor-dashboard-feedbacks';

import { Space, Button, TextInput, Select, Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

jest.mock('@mantine/hooks', () => {
   
    const actualHooks = jest.requireActual('@mantine/hooks');
    return {
        ...actualHooks,
    useMediaQuery: jest.fn(() => [true]),

};
});

jest.mock('react', ()=> ({
    ...jest.requireActual('react'),
    useEffect: jest.fn(),
}));

fetchMock.enableMocks();

global.HTMLElement.prototype.scrollIntoView = jest.fn();

beforeEach(() => {
         global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
    global.alert = jest.fn();


});


afterEach(() => {
global.fetch.mockClear();
jest.resetAllMocks();

});

describe("Instructor dashboard feedbacks", () =>{

    //displays courses
    it("displays courses", ()=>{

        const mockOrganizations = [
            {id: "23", name: "Concordia University"}
        ]

        const mockcourse = [
            {id: "23", name: "biology", organization_id: "23"}
        ]
    
        const mocksetLoggedIn = jest.fn();
        const mockorg = "Concordia University"

        const mockteam =[
            {id:"23",name:"best",max_size: 5, course_id:"23"}
        ]
    
        const mockstudents =[
            {organization_id: "23", id:"2345", name:"lindt"}
        ]
    
        const mockmembership =[
            {student_id:"23456",id:"23", team_id:"23"}
        ]
    
        const mockemail = "qwe@qwe.qwe"

        const mockuser = {token: "token"};
        const mocknavigation = jest.fn();


        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <InstructorFeedbackTab  teams={mockteam} org={mockorg}  organizations={mockOrganizations} courses={mockcourse} setLoggedIn={mocksetLoggedIn}  email={mockemail} memberships={mockmembership} students={mockstudents}  user={mockuser} navigation={mocknavigation}  />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();

    });



        //displays instructor email
        it("displays instructor email", ()=>{

            const mockOrganizations = [
                {id: "23", name: "Concordia University"}
            ]
    
            const mockcourse = [
                {id: "23", name: "biology", organization_id: "23"}
            ]
        
            const mocksetLoggedIn = jest.fn();
            const mockorg = "Concordia University"
    
            const mockteam =[
                {id:"23",name:"best",max_size: 5, course_id:"23"}
            ]
        
            const mockstudents =[
                {organization_id: "23", id:"2345", name:"lindt"}
            ]
        
            const mockmembership =[
                {student_id:"23456",id:"23", team_id:"23"}
            ]
        
            const mockemail = "qwe@qwe.qwe"
    
            const mockuser = {token: "token"};
            const mocknavigation = jest.fn();
    
    
            render(
                <MantineProvider withGlobalStyles withNormalizeCSS>
                <MemoryRouter >
                <InstructorFeedbackTab  teams={mockteam} org={mockorg}  organizations={mockOrganizations} courses={mockcourse} setLoggedIn={mocksetLoggedIn}  email={mockemail} memberships={mockmembership} students={mockstudents}  user={mockuser} navigation={mocknavigation}  />
                </MemoryRouter>
                </MantineProvider>
                );
    
                expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();

    
        });
    

             //displays organization id
             it("displays organization id", ()=>{

                const mockOrganizations = [
                    {id: "23", name: "Concordia University"}
                ]
        
                const mockcourse = [
                    {id: "23", name: "biology", organization_id: "23"}
                ]
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"best",max_size: 5, course_id:"23"}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab  teams={mockteam} org={mockorg}  organizations={mockOrganizations} courses={mockcourse} setLoggedIn={mocksetLoggedIn}  email={mockemail} memberships={mockmembership} students={mockstudents}  user={mockuser} navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();

            });

             //can display courses 
             it("can display courses", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ]
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ]
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"best",max_size: 5, course_id:"23"}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab  teams={mockteam} org={mockorg}  organizations={mockOrganizations} courses={mockcourse} setLoggedIn={mocksetLoggedIn}  email={mockemail} memberships={mockmembership} students={mockstudents}  user={mockuser} navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();


            });

               //can click courses 
               it("can click courses", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"best",max_size: 5, course_id:"23"}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));


            });



               //display back to course list
               it("display back to course list", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"best",max_size: 5, course_id:"23"}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();



            });


                  //click back to course list
                  it("click back to course list", ()=>{

                    const mockOrganizations = [
                        {id: "org1", name: "Concordia University"}
                    ];
            
                    const mockcourse = [
                        {id: "23", name: "Software Engineering", organization_id: "org1"},
                     
                    ];
                
                    const mocksetLoggedIn = jest.fn();
                    const mockorg = "Concordia University"
            
                    const mockteam =[
                        {id:"23",name:"best",max_size: 5, course_id:"23"}
                    ]
                
                    const mockstudents =[
                        {organization_id: "23", id:"2345", name:"lindt"}
                    ]
                
                    const mockmembership =[
                        {student_id:"23456",id:"23", team_id:"23"}
                    ]
                
                    const mockemail = "qwe@qwe.qwe"
            
                    const mockuser = {token: "token"};
                    const mocknavigation = jest.fn();
            
                    const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                    global.fetch= jest.fn(()=>
                    Promise.resolve({
                        json: ()=>  Promise.resolve({})
                    })
                    );
            
                    render(
                        <MantineProvider withGlobalStyles withNormalizeCSS>
                        <MemoryRouter >
                        <InstructorFeedbackTab 
                          teams={mockteam} 
                          org={mockorg}  
                          organizations={mockOrganizations}
                          courses={mockcourse}
                           setLoggedIn={mocksetLoggedIn} 
                            email={mockemail}
                             memberships={mockmembership} 
                             students={mockstudents} 
                              user={mockuser}
                            navigation={mocknavigation}  />
                        </MemoryRouter>
                        </MantineProvider>
                        );
            
                        expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                        expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                        expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Software Engineering/i));
                        expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Back to Course List/i));

    
    
                });

                      //click back to course list
                      it("click back to course list", ()=>{

                        const mockOrganizations = [
                            {id: "org1", name: "Concordia University"}
                        ];
                
                        const mockcourse = [
                            {id: "23", name: "Software Engineering", organization_id: "org1"},
                         
                        ];
                    
                        const mocksetLoggedIn = jest.fn();
                        const mockorg = "Concordia University"
                
                        const mockteam =[
                            {id:"23",name:"best",max_size: 5, course_id:"23"}
                        ]
                    
                        const mockstudents =[
                            {organization_id: "23", id:"2345", name:"lindt"}
                        ]
                    
                        const mockmembership =[
                            {student_id:"23456",id:"23", team_id:"23"}
                        ]
                    
                        const mockemail = "qwe@qwe.qwe"
                
                        const mockuser = {token: "token"};
                        const mocknavigation = jest.fn();
                
                        const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
        
                        global.fetch= jest.fn(()=>
                        Promise.resolve({
                            json: ()=>  Promise.resolve({})
                        })
                        );
                
                        render(
                            <MantineProvider withGlobalStyles withNormalizeCSS>
                            <MemoryRouter >
                            <InstructorFeedbackTab 
                              teams={mockteam} 
                              org={mockorg}  
                              organizations={mockOrganizations}
                              courses={mockcourse}
                               setLoggedIn={mocksetLoggedIn} 
                                email={mockemail}
                                 memberships={mockmembership} 
                                 students={mockstudents} 
                                  user={mockuser}
                                navigation={mocknavigation}  />
                            </MemoryRouter>
                            </MantineProvider>
                            );
                
                            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                            expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                            expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                            expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                            fireEvent.click(screen.getByText(/Software Engineering/i));
                            expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                            fireEvent.click(screen.getByText(/Back to Course List/i));
    
        
        
                    });

                          //display teams
                  it("display teams", ()=>{

                    const mockOrganizations = [
                        {id: "org1", name: "Concordia University"}
                    ];
            
                    const mockcourse = [
                        {id: "23", name: "Software Engineering", organization_id: "org1"},
                     
                    ];
                
                    const mocksetLoggedIn = jest.fn();
                    const mockorg = "Concordia University"
            
                    const mockteam =[
                        {id:"23",name:"best",max_size: 5, course_id:"23"}
                    ]
                
                    const mockstudents =[
                        {organization_id: "23", id:"2345", name:"lindt"}
                    ]
                
                    const mockmembership =[
                        {student_id:"23456",id:"23", team_id:"23"}
                    ]
                
                    const mockemail = "qwe@qwe.qwe"
            
                    const mockuser = {token: "token"};
                    const mocknavigation = jest.fn();
            
                    const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                    global.fetch= jest.fn(()=>
                    Promise.resolve({
                        json: ()=>  Promise.resolve({})
                    })
                    );
            
                    render(
                        <MantineProvider withGlobalStyles withNormalizeCSS>
                        <MemoryRouter >
                        <InstructorFeedbackTab 
                          teams={mockteam} 
                          org={mockorg}  
                          organizations={mockOrganizations}
                          courses={mockcourse}
                           setLoggedIn={mocksetLoggedIn} 
                            email={mockemail}
                             memberships={mockmembership} 
                             students={mockstudents} 
                              user={mockuser}
                            navigation={mocknavigation}  />
                        </MemoryRouter>
                        </MantineProvider>
                        );
            
                        expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                        expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                        expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Software Engineering/i));
                        expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Teams in Software Engineering/i)).toBeInTheDocument();

    
    
                });


                              //display team names
                              it("display team names", ()=>{

                                const mockOrganizations = [
                                    {id: "org1", name: "Concordia University"}
                                ];
                        
                                const mockcourse = [
                                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                                 
                                ];
                            
                                const mocksetLoggedIn = jest.fn();
                                const mockorg = "Concordia University"
                        
                                const mockteam =[
                                    {id:"23",name:"best",max_size: 5, course_id:"23"}
                                ]
                            
                                const mockstudents =[
                                    {organization_id: "23", id:"2345", name:"lindt"}
                                ]
                            
                                const mockmembership =[
                                    {student_id:"23456",id:"23", team_id:"23"}
                                ]
                            
                                const mockemail = "qwe@qwe.qwe"
                        
                                const mockuser = {token: "token"};
                                const mocknavigation = jest.fn();
                        
                                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
                
                                global.fetch= jest.fn(()=>
                                Promise.resolve({
                                    json: ()=>  Promise.resolve({})
                                })
                                );
                        
                                render(
                                    <MantineProvider withGlobalStyles withNormalizeCSS>
                                    <MemoryRouter >
                                    <InstructorFeedbackTab 
                                      teams={mockteam} 
                                      org={mockorg}  
                                      organizations={mockOrganizations}
                                      courses={mockcourse}
                                       setLoggedIn={mocksetLoggedIn} 
                                        email={mockemail}
                                         memberships={mockmembership} 
                                         students={mockstudents} 
                                          user={mockuser}
                                        navigation={mocknavigation}  />
                                    </MemoryRouter>
                                    </MantineProvider>
                                    );
                        
                                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                                    fireEvent.click(screen.getByText(/Software Engineering/i));
                                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            
                
                
                            });



                
                              //display team size
                              it("display team size", ()=>{

                                const mockOrganizations = [
                                    {id: "org1", name: "Concordia University"}
                                ];
                        
                                const mockcourse = [
                                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                                 
                                ];
                            
                                const mocksetLoggedIn = jest.fn();
                                const mockorg = "Concordia University"
                        
                                const mockteam =[
                                    {id:"23",name:"best",max_size: 5, course_id:"23"}
                                ]
                            
                                const mockstudents =[
                                    {organization_id: "23", id:"2345", name:"lindt"}
                                ]
                            
                                const mockmembership =[
                                    {student_id:"23456",id:"23", team_id:"23"}
                                ]
                            
                                const mockemail = "qwe@qwe.qwe"
                        
                                const mockuser = {token: "token"};
                                const mocknavigation = jest.fn();
                        
                                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
                
                                global.fetch= jest.fn(()=>
                                Promise.resolve({
                                    json: ()=>  Promise.resolve({})
                                })
                                );
                        
                                render(
                                    <MantineProvider withGlobalStyles withNormalizeCSS>
                                    <MemoryRouter >
                                    <InstructorFeedbackTab 
                                      teams={mockteam} 
                                      org={mockorg}  
                                      organizations={mockOrganizations}
                                      courses={mockcourse}
                                       setLoggedIn={mocksetLoggedIn} 
                                        email={mockemail}
                                         memberships={mockmembership} 
                                         students={mockstudents} 
                                          user={mockuser}
                                        navigation={mocknavigation}  />
                                    </MemoryRouter>
                                    </MantineProvider>
                                    );
                        
                                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                                    fireEvent.click(screen.getByText(/Software Engineering/i));
                                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
            
                
                
                            });


           //display Max Size
           it("display Max Size", ()=>{

            const mockOrganizations = [
                {id: "org1", name: "Concordia University"}
            ];
    
            const mockcourse = [
                {id: "23", name: "Software Engineering", organization_id: "org1"},
             
            ];
        
            const mocksetLoggedIn = jest.fn();
            const mockorg = "Concordia University"
    
            const mockteam =[
                {id:"23",name:"best",max_size: 5, course_id:"23"}
            ]
        
            const mockstudents =[
                {organization_id: "23", id:"2345", name:"lindt"}
            ]
        
            const mockmembership =[
                {student_id:"23456",id:"23", team_id:"23"}
            ]
        
            const mockemail = "qwe@qwe.qwe"
    
            const mockuser = {token: "token"};
            const mocknavigation = jest.fn();
    
            const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

            global.fetch= jest.fn(()=>
            Promise.resolve({
                json: ()=>  Promise.resolve({})
            })
            );
    
            render(
                <MantineProvider withGlobalStyles withNormalizeCSS>
                <MemoryRouter >
                <InstructorFeedbackTab 
                  teams={mockteam} 
                  org={mockorg}  
                  organizations={mockOrganizations}
                  courses={mockcourse}
                   setLoggedIn={mocksetLoggedIn} 
                    email={mockemail}
                     memberships={mockmembership} 
                     students={mockstudents} 
                      user={mockuser}
                    navigation={mocknavigation}  />
                </MemoryRouter>
                </MantineProvider>
                );
    
                expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Software Engineering/i));
                expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                expect(screen.getByText(/Max Size/i)).toBeInTheDocument();

        });



           //display no. of Feedbacks from Unique Authors
           it("display no. of Feedbacks from Unique Authors", ()=>{

            const mockOrganizations = [
                {id: "org1", name: "Concordia University"}
            ];
    
            const mockcourse = [
                {id: "23", name: "Software Engineering", organization_id: "org1"},
             
            ];
        
            const mocksetLoggedIn = jest.fn();
            const mockorg = "Concordia University"
    
            const mockteam =[
                {id:"23",name:"best",max_size: 5, course_id:"23"}
            ]
        
            const mockstudents =[
                {organization_id: "23", id:"2345", name:"lindt"}
            ]
        
            const mockmembership =[
                {student_id:"23456",id:"23", team_id:"23"}
            ]
        
            const mockemail = "qwe@qwe.qwe"
    
            const mockuser = {token: "token"};
            const mocknavigation = jest.fn();
    
            const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

            global.fetch= jest.fn(()=>
            Promise.resolve({
                json: ()=>  Promise.resolve({})
            })
            );
    
            render(
                <MantineProvider withGlobalStyles withNormalizeCSS>
                <MemoryRouter >
                <InstructorFeedbackTab 
                  teams={mockteam} 
                  org={mockorg}  
                  organizations={mockOrganizations}
                  courses={mockcourse}
                   setLoggedIn={mocksetLoggedIn} 
                    email={mockemail}
                     memberships={mockmembership} 
                     students={mockstudents} 
                      user={mockuser}
                    navigation={mocknavigation}  />
                </MemoryRouter>
                </MantineProvider>
                );
    
                expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Software Engineering/i));
                expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();

        });
            
            //display Badges
            it("display Badges", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23"}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();

            });
               

              //display name of team
              it("display name of team", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();

            });
        
              //display size of team
              it("display size of team", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();

            });



              //display max size of team
              it("display max size of team", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();

            });


              //display Feedbacks from Unique Authors  of team
              it("display Feedbacks from Unique Authors of team", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();


            });

             //display Badges of team
             it("display Badges of team", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();


            });


              //click the teams to get more info
              it("click the teams to get more info", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));


            });



              //display list of students that belong to the team
              it("display list of students that belong to the team", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));
                    expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();


            });
        
             //back to team list button
             it("back to team list button", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));
                    expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();


            });


               //display student name
               it("display student name", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));
                    expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();


            });


               //display Email
               it("display Email", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));
                    expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Email/i)).toBeInTheDocument();


            });


               //display Role
               it("display Role", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"lindt"}
                ]
            
                const mockmembership =[
                    {student_id:"23456",id:"23", team_id:"23"}
                ]
            
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));
                    expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Email/i)).toBeInTheDocument();
                    expect(screen.getByText(/Role/i)).toBeInTheDocument();


            });


                 // name of students part of the team 
                 it("name of students part of the team ", ()=>{

                    const mockOrganizations = [
                        {id: "org1", name: "Concordia University"}
                    ];
            
                    const mockcourse = [
                        {id: "23", name: "Software Engineering", organization_id: "org1"},
                     
                    ];
                
                    const mocksetLoggedIn = jest.fn();
                    const mockorg = "Concordia University"
            
                    const mockteam =[
                        {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                    ]
                
                    const mockstudents =[
                        {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345"}
                    ]
                
                    const mockmembership =[
                        {student_id:"2345",id:"23", team_id:"23"}
                    ]
                
                    const team_memberships = [
                        {id: "2345",
                        team_id: "23",
                        student_id: "2345"}
                    ]

                    const mockemail = "qwe@qwe.qwe"
            
                    const mockuser = {token: "token"};
                    const mocknavigation = jest.fn();
            
                    const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
        
                    global.fetch= jest.fn(()=>
                    Promise.resolve({
                        json: ()=>  Promise.resolve({})
                    })
                    );
                    const mockteam_rows = [
                        <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                        </tr>
                    ];

                   
                      const mockstudent_rows = [
                        <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                        </tr>
                    ];            
                    render(
                        <MantineProvider withGlobalStyles withNormalizeCSS>
                        <MemoryRouter >
                        <InstructorFeedbackTab 
                        student_rows ={mockstudent_rows}
                        team_rows={mockteam_rows}
                          teams={mockteam} 
                          org={mockorg}  
                          organizations={mockOrganizations}
                          courses={mockcourse}
                           setLoggedIn={mocksetLoggedIn} 
                            email={mockemail}
                             memberships={mockmembership} 
                             students={mockstudents} 
                              user={mockuser}
                            navigation={mocknavigation}  />
                        </MemoryRouter>
                        </MantineProvider>
                        );
            
                        expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                        expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                        expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Software Engineering/i));
                        expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                        expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                        expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/0/i)).toBeInTheDocument();
                        expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Team Alpha/i));
                        expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                        expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();

    
                });


                 // email of students part of the team 
                 it("name of students part of the team ", ()=>{

                    const mockOrganizations = [
                        {id: "org1", name: "Concordia University"}
                    ];
            
                    const mockcourse = [
                        {id: "23", name: "Software Engineering", organization_id: "org1"},
                     
                    ];
                
                    const mocksetLoggedIn = jest.fn();
                    const mockorg = "Concordia University"
            
                    const mockteam =[
                        {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                    ]
                
                    const mockstudents =[
                        {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com"}
                    ]
                
                    const mockmembership =[
                        {student_id:"2345",id:"23", team_id:"23"}
                    ]
                
                    const team_memberships = [
                        {id: "2345",
                        team_id: "23",
                        student_id: "2345"}
                    ]

                    const mockemail = "qwe@qwe.qwe"
            
                    const mockuser = {token: "token"};
                    const mocknavigation = jest.fn();
            
                    const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
        
                    global.fetch= jest.fn(()=>
                    Promise.resolve({
                        json: ()=>  Promise.resolve({})
                    })
                    );
                    const mockteam_rows = [
                        <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                        </tr>
                    ];

                   
                      const mockstudent_rows = [
                        <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                        </tr>
                    ];            
                    render(
                        <MantineProvider withGlobalStyles withNormalizeCSS>
                        <MemoryRouter >
                        <InstructorFeedbackTab 
                        student_rows ={mockstudent_rows}
                        team_rows={mockteam_rows}
                          teams={mockteam} 
                          org={mockorg}  
                          organizations={mockOrganizations}
                          courses={mockcourse}
                           setLoggedIn={mocksetLoggedIn} 
                            email={mockemail}
                             memberships={mockmembership} 
                             students={mockstudents} 
                              user={mockuser}
                            navigation={mocknavigation}  />
                        </MemoryRouter>
                        </MantineProvider>
                        );
            
                        expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                        expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                        expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Software Engineering/i));
                        expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                        expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                        expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/0/i)).toBeInTheDocument();
                        expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Team Alpha/i));
                        expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                        expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                        expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();

                });


                  // role of students part of the team 
                  it("role of students part of the team ", ()=>{

                    const mockOrganizations = [
                        {id: "org1", name: "Concordia University"}
                    ];
            
                    const mockcourse = [
                        {id: "23", name: "Software Engineering", organization_id: "org1"},
                     
                    ];
                
                    const mocksetLoggedIn = jest.fn();
                    const mockorg = "Concordia University"
            
                    const mockteam =[
                        {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                    ]
                
                    const mockstudents =[
                        {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
                    ]
                
                    const mockmembership =[
                        {student_id:"2345",id:"23", team_id:"23"}
                    ]
                
                    const team_memberships = [
                        {id: "2345",
                        team_id: "23",
                        student_id: "2345"}
                    ]

                    const mockemail = "qwe@qwe.qwe"
            
                    const mockuser = {token: "token"};
                    const mocknavigation = jest.fn();
            
                    const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
        
                    global.fetch= jest.fn(()=>
                    Promise.resolve({
                        json: ()=>  Promise.resolve({})
                    })
                    );
                    const mockteam_rows = [
                        <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                        </tr>
                    ];

                   
                      const mockstudent_rows = [
                        <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                        </tr>
                    ];            
                    render(
                        <MantineProvider withGlobalStyles withNormalizeCSS>
                        <MemoryRouter >
                        <InstructorFeedbackTab 
                        student_rows ={mockstudent_rows}
                        team_rows={mockteam_rows}
                          teams={mockteam} 
                          org={mockorg}  
                          organizations={mockOrganizations}
                          courses={mockcourse}
                           setLoggedIn={mocksetLoggedIn} 
                            email={mockemail}
                             memberships={mockmembership} 
                             students={mockstudents} 
                              user={mockuser}
                            navigation={mocknavigation}  />
                        </MemoryRouter>
                        </MantineProvider>
                        );
            
                        expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                        expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                        expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Software Engineering/i));
                        expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                        expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                        expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/0/i)).toBeInTheDocument();
                        expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Team Alpha/i));
                        expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                        expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                        expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                        expect(screen.getByText(/student/)).toBeInTheDocument();

                });


                  // can click on students
                  it("can click on students", ()=>{

                    const mockOrganizations = [
                        {id: "org1", name: "Concordia University"}
                    ];
            
                    const mockcourse = [
                        {id: "23", name: "Software Engineering", organization_id: "org1"},
                     
                    ];
                
                    const mocksetLoggedIn = jest.fn();
                    const mockorg = "Concordia University"
            
                    const mockteam =[
                        {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                    ]
                
                    const mockstudents =[
                        {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
                    ]
                
                    const mockmembership =[
                        {student_id:"2345",id:"23", team_id:"23"}
                    ]
                
                    const team_memberships = [
                        {id: "2345",
                        team_id: "23",
                        student_id: "2345"}
                    ]

                    const mockemail = "qwe@qwe.qwe"
            
                    const mockuser = {token: "token"};
                    const mocknavigation = jest.fn();
            
                    const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
        
                    global.fetch= jest.fn(()=>
                    Promise.resolve({
                        json: ()=>  Promise.resolve({})
                    })
                    );
                    const mockteam_rows = [
                        <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                        </tr>
                    ];

                   
                      const mockstudent_rows = [
                        <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                        </tr>
                    ];            
                    render(
                        <MantineProvider withGlobalStyles withNormalizeCSS>
                        <MemoryRouter >
                        <InstructorFeedbackTab 
                        student_rows ={mockstudent_rows}
                        team_rows={mockteam_rows}
                          teams={mockteam} 
                          org={mockorg}  
                          organizations={mockOrganizations}
                          courses={mockcourse}
                           setLoggedIn={mocksetLoggedIn} 
                            email={mockemail}
                             memberships={mockmembership} 
                             students={mockstudents} 
                              user={mockuser}
                            navigation={mocknavigation}  />
                        </MemoryRouter>
                        </MantineProvider>
                        );
            
                        expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                        expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                        expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Software Engineering/i));
                        expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                        expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                        expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/0/i)).toBeInTheDocument();
                        expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Team Alpha/i));
                        expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                        expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                        expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                        expect(screen.getByText(/student/)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Sophia Taylor/i));

                });

                  // display student id
                  it(" display student id", ()=>{

                    const mockOrganizations = [
                        {id: "org1", name: "Concordia University"}
                    ];
            
                    const mockcourse = [
                        {id: "23", name: "Software Engineering", organization_id: "org1"},
                     
                    ];
                
                    const mocksetLoggedIn = jest.fn();
                    const mockorg = "Concordia University"
            
                    const mockteam =[
                        {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                    ]
                
                    const mockstudents =[
                        {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
                    ]
                
                    const mockmembership =[
                        {student_id:"2345",id:"23", team_id:"23"}
                    ]
                
                    const team_memberships = [
                        {id: "2345",
                        team_id: "23",
                        student_id: "2345"}
                    ]

                    const mockemail = "qwe@qwe.qwe"
            
                    const mockuser = {token: "token"};
                    const mocknavigation = jest.fn();
            
                    const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
        
                    global.fetch= jest.fn(()=>
                    Promise.resolve({
                        json: ()=>  Promise.resolve({})
                    })
                    );
                    const mockteam_rows = [
                        <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                        </tr>
                    ];

                   
                      const mockstudent_rows = [
                        <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                        </tr>
                    ];            
                    render(
                        <MantineProvider withGlobalStyles withNormalizeCSS>
                        <MemoryRouter >
                        <InstructorFeedbackTab 
                        student_rows ={mockstudent_rows}
                        team_rows={mockteam_rows}
                          teams={mockteam} 
                          org={mockorg}  
                          organizations={mockOrganizations}
                          courses={mockcourse}
                           setLoggedIn={mocksetLoggedIn} 
                            email={mockemail}
                             memberships={mockmembership} 
                             students={mockstudents} 
                              user={mockuser}
                            navigation={mocknavigation}  />
                        </MemoryRouter>
                        </MantineProvider>
                        );
            
                        expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                        expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                        expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Software Engineering/i));
                        expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                        expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                        expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                        expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                        expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/5/i)).toBeInTheDocument();
                        expect(screen.getByText(/0/i)).toBeInTheDocument();
                        expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Team Alpha/i));
                        expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                        expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                        expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                        expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                        expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                        expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                        expect(screen.getByText(/student/)).toBeInTheDocument();
                        fireEvent.click(screen.getByText(/Sophia Taylor/i));
                        expect(screen.getByText(/Student ID/i)).toBeInTheDocument();

                });

                    // display student name
                    it(" display student name", ()=>{

                        const mockOrganizations = [
                            {id: "org1", name: "Concordia University"}
                        ];
                
                        const mockcourse = [
                            {id: "23", name: "Software Engineering", organization_id: "org1"},
                         
                        ];
                    
                        const mocksetLoggedIn = jest.fn();
                        const mockorg = "Concordia University"
                
                        const mockteam =[
                            {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                        ]
                    
                        const mockstudents =[
                            {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
                        ]
                    
                        const mockmembership =[
                            {student_id:"2345",id:"23", team_id:"23"}
                        ]
                    
                        const team_memberships = [
                            {id: "2345",
                            team_id: "23",
                            student_id: "2345"}
                        ]
    
                        const mockemail = "qwe@qwe.qwe"
                
                        const mockuser = {token: "token"};
                        const mocknavigation = jest.fn();
                
                        const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
            
                        global.fetch= jest.fn(()=>
                        Promise.resolve({
                            json: ()=>  Promise.resolve({})
                        })
                        );
                        const mockteam_rows = [
                            <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                            </tr>
                        ];
    
                       
                          const mockstudent_rows = [
                            <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                            </tr>
                        ];            
                        render(
                            <MantineProvider withGlobalStyles withNormalizeCSS>
                            <MemoryRouter >
                            <InstructorFeedbackTab 
                            student_rows ={mockstudent_rows}
                            team_rows={mockteam_rows}
                              teams={mockteam} 
                              org={mockorg}  
                              organizations={mockOrganizations}
                              courses={mockcourse}
                               setLoggedIn={mocksetLoggedIn} 
                                email={mockemail}
                                 memberships={mockmembership} 
                                 students={mockstudents} 
                                  user={mockuser}
                                navigation={mocknavigation}  />
                            </MemoryRouter>
                            </MantineProvider>
                            );
                
                            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                            expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                            expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                            expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                            fireEvent.click(screen.getByText(/Software Engineering/i));
                            expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                            expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                            expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                            expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                            expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                            expect(screen.getByText(/5/i)).toBeInTheDocument();
                            expect(screen.getByText(/5/i)).toBeInTheDocument();
                            expect(screen.getByText(/0/i)).toBeInTheDocument();
                            expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                            fireEvent.click(screen.getByText(/Team Alpha/i));
                            expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                            expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                            expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                            expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                            expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                            expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                            expect(screen.getByText(/student/)).toBeInTheDocument();
                            fireEvent.click(screen.getByText(/Sophia Taylor/i));
                            expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
                            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();

                    });

                      // display team name
                      it(" display team name", ()=>{

                        const mockOrganizations = [
                            {id: "org1", name: "Concordia University"}
                        ];
                
                        const mockcourse = [
                            {id: "23", name: "Software Engineering", organization_id: "org1"},
                         
                        ];
                    
                        const mocksetLoggedIn = jest.fn();
                        const mockorg = "Concordia University"
                
                        const mockteam =[
                            {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                        ]
                    
                        const mockstudents =[
                            {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
                        ]
                    
                        const mockmembership =[
                            {student_id:"2345",id:"23", team_id:"23"}
                        ]
                    
                        const team_memberships = [
                            {id: "2345",
                            team_id: "23",
                            student_id: "2345"}
                        ]
    
                        const mockemail = "qwe@qwe.qwe"
                
                        const mockuser = {token: "token"};
                        const mocknavigation = jest.fn();
                
                        const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
            
                        global.fetch= jest.fn(()=>
                        Promise.resolve({
                            json: ()=>  Promise.resolve({})
                        })
                        );
                        const mockteam_rows = [
                            <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                            </tr>
                        ];
    
                       
                          const mockstudent_rows = [
                            <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                            </tr>
                        ];            
                        render(
                            <MantineProvider withGlobalStyles withNormalizeCSS>
                            <MemoryRouter >
                            <InstructorFeedbackTab 
                            student_rows ={mockstudent_rows}
                            team_rows={mockteam_rows}
                              teams={mockteam} 
                              org={mockorg}  
                              organizations={mockOrganizations}
                              courses={mockcourse}
                               setLoggedIn={mocksetLoggedIn} 
                                email={mockemail}
                                 memberships={mockmembership} 
                                 students={mockstudents} 
                                  user={mockuser}
                                navigation={mocknavigation}  />
                            </MemoryRouter>
                            </MantineProvider>
                            );
                
                            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                            expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                            expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                            expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                            fireEvent.click(screen.getByText(/Software Engineering/i));
                            expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                            expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                            expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                            expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                            expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                            expect(screen.getByText(/5/i)).toBeInTheDocument();
                            expect(screen.getByText(/5/i)).toBeInTheDocument();
                            expect(screen.getByText(/0/i)).toBeInTheDocument();
                            expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                            fireEvent.click(screen.getByText(/Team Alpha/i));
                            expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                            expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                            expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                            expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                            expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                            expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                            expect(screen.getByText(/student/)).toBeInTheDocument();
                            fireEvent.click(screen.getByText(/Sophia Taylor/i));
                            expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
                            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();

                    });

                        // display cooperation
                        it(" display cooperation", ()=>{

                            const mockOrganizations = [
                                {id: "org1", name: "Concordia University"}
                            ];
                    
                            const mockcourse = [
                                {id: "23", name: "Software Engineering", organization_id: "org1"},
                             
                            ];
                        
                            const mocksetLoggedIn = jest.fn();
                            const mockorg = "Concordia University"
                    
                            const mockteam =[
                                {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                            ]
                        
                            const mockstudents =[
                                {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
                            ]
                        
                            const mockmembership =[
                                {student_id:"2345",id:"23", team_id:"23"}
                            ]
                        
                            const team_memberships = [
                                {id: "2345",
                                team_id: "23",
                                student_id: "2345"}
                            ]
        
                            const mockemail = "qwe@qwe.qwe"
                    
                            const mockuser = {token: "token"};
                            const mocknavigation = jest.fn();
                    
                            const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
                
                            global.fetch= jest.fn(()=>
                            Promise.resolve({
                                json: ()=>  Promise.resolve({})
                            })
                            );
                            const mockteam_rows = [
                                <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                                </tr>
                            ];
        
                           
                              const mockstudent_rows = [
                                <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                                </tr>
                            ];            
                            render(
                                <MantineProvider withGlobalStyles withNormalizeCSS>
                                <MemoryRouter >
                                <InstructorFeedbackTab 
                                student_rows ={mockstudent_rows}
                                team_rows={mockteam_rows}
                                  teams={mockteam} 
                                  org={mockorg}  
                                  organizations={mockOrganizations}
                                  courses={mockcourse}
                                   setLoggedIn={mocksetLoggedIn} 
                                    email={mockemail}
                                     memberships={mockmembership} 
                                     students={mockstudents} 
                                      user={mockuser}
                                    navigation={mocknavigation}  />
                                </MemoryRouter>
                                </MantineProvider>
                                );
                    
                                expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                                expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                                expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                                expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                                fireEvent.click(screen.getByText(/Software Engineering/i));
                                expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                                expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                                expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                                expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                                expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                                expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                                expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                                expect(screen.getByText(/5/i)).toBeInTheDocument();
                                expect(screen.getByText(/5/i)).toBeInTheDocument();
                                expect(screen.getByText(/0/i)).toBeInTheDocument();
                                expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                                fireEvent.click(screen.getByText(/Team Alpha/i));
                                expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                                expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                                expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                                expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                                expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                                expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                                expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                                expect(screen.getByText(/student/)).toBeInTheDocument();
                                fireEvent.click(screen.getByText(/Sophia Taylor/i));
                                expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
                                expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                                expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                                expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();

    
                        });

             // display conceptual contribution
             it(" display conceptual contribution", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
                ]
            
                const mockmembership =[
                    {student_id:"2345",id:"23", team_id:"23"}
                ]
            
                const team_memberships = [
                    {id: "2345",
                    team_id: "23",
                    student_id: "2345"}
                ]

                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];

               
                  const mockstudent_rows = [
                    <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                    </tr>
                ];            
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    student_rows ={mockstudent_rows}
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));
                    expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                    expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                    expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                    expect(screen.getByText(/student/)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Sophia Taylor/i));
                    expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
                    expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();


            });
    
            // display practical contribution
            it(" display practical contribution", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
                ]
            
                const mockmembership =[
                    {student_id:"2345",id:"23", team_id:"23"}
                ]
            
                const team_memberships = [
                    {id: "2345",
                    team_id: "23",
                    student_id: "2345"}
                ]

                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];

               
                  const mockstudent_rows = [
                    <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                    </tr>
                ];            
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    student_rows ={mockstudent_rows}
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));
                    expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                    expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                    expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                    expect(screen.getByText(/student/)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Sophia Taylor/i));
                    expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
                    expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
                    expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();


            });
     // display work ethic
     it(" display work ethic", ()=>{

        const mockOrganizations = [
            {id: "org1", name: "Concordia University"}
        ];

        const mockcourse = [
            {id: "23", name: "Software Engineering", organization_id: "org1"},
         
        ];
    
        const mocksetLoggedIn = jest.fn();
        const mockorg = "Concordia University"

        const mockteam =[
            {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
        ]
    
        const mockstudents =[
            {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
        ]
    
        const mockmembership =[
            {student_id:"2345",id:"23", team_id:"23"}
        ]
    
        const team_memberships = [
            {id: "2345",
            team_id: "23",
            student_id: "2345"}
        ]

        const mockemail = "qwe@qwe.qwe"

        const mockuser = {token: "token"};
        const mocknavigation = jest.fn();

        const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

        global.fetch= jest.fn(()=>
        Promise.resolve({
            json: ()=>  Promise.resolve({})
        })
        );
        const mockteam_rows = [
            <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
            </tr>
        ];

       
          const mockstudent_rows = [
            <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
            </tr>
        ];            
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <InstructorFeedbackTab 
            student_rows ={mockstudent_rows}
            team_rows={mockteam_rows}
              teams={mockteam} 
              org={mockorg}  
              organizations={mockOrganizations}
              courses={mockcourse}
               setLoggedIn={mocksetLoggedIn} 
                email={mockemail}
                 memberships={mockmembership} 
                 students={mockstudents} 
                  user={mockuser}
                navigation={mocknavigation}  />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
            expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Software Engineering/i));
            expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/0/i)).toBeInTheDocument();
            expect(screen.getByText(/⏳/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Team Alpha/i));
            expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/email/i)).toBeInTheDocument();
            expect(screen.getByTestId(/role/i)).toBeInTheDocument();
            expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
            expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
            expect(screen.getByText(/student/)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Sophia Taylor/i));
            expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
            expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/work ethic/i)).toBeInTheDocument();


    });

      // display average
      it(" display average", ()=>{

        const mockOrganizations = [
            {id: "org1", name: "Concordia University"}
        ];

        const mockcourse = [
            {id: "23", name: "Software Engineering", organization_id: "org1"},
         
        ];
    
        const mocksetLoggedIn = jest.fn();
        const mockorg = "Concordia University"

        const mockteam =[
            {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
        ]
    
        const mockstudents =[
            {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
        ]
    
        const mockmembership =[
            {student_id:"2345",id:"23", team_id:"23"}
        ]
    
        const team_memberships = [
            {id: "2345",
            team_id: "23",
            student_id: "2345"}
        ]

        const mockemail = "qwe@qwe.qwe"

        const mockuser = {token: "token"};
        const mocknavigation = jest.fn();

        const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

        global.fetch= jest.fn(()=>
        Promise.resolve({
            json: ()=>  Promise.resolve({})
        })
        );
        const mockteam_rows = [
            <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
            </tr>
        ];

       
          const mockstudent_rows = [
            <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
            </tr>
        ];            
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <InstructorFeedbackTab 
            student_rows ={mockstudent_rows}
            team_rows={mockteam_rows}
              teams={mockteam} 
              org={mockorg}  
              organizations={mockOrganizations}
              courses={mockcourse}
               setLoggedIn={mocksetLoggedIn} 
                email={mockemail}
                 memberships={mockmembership} 
                 students={mockstudents} 
                  user={mockuser}
                navigation={mocknavigation}  />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
            expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Software Engineering/i));
            expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/0/i)).toBeInTheDocument();
            expect(screen.getByText(/⏳/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Team Alpha/i));
            expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/email/i)).toBeInTheDocument();
            expect(screen.getByTestId(/role/i)).toBeInTheDocument();
            expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
            expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
            expect(screen.getByText(/student/)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Sophia Taylor/i));
            expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
            expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/work ethic/i)).toBeInTheDocument();
            expect(screen.getByText(/average/i)).toBeInTheDocument();


    });

     // display no. of Peers Who Reviewed
     it(" display no. of Peers Who Reviewed", ()=>{

        const mockOrganizations = [
            {id: "org1", name: "Concordia University"}
        ];

        const mockcourse = [
            {id: "23", name: "Software Engineering", organization_id: "org1"},
         
        ];
    
        const mocksetLoggedIn = jest.fn();
        const mockorg = "Concordia University"

        const mockteam =[
            {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
        ]
    
        const mockstudents =[
            {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
        ]
    
        const mockmembership =[
            {student_id:"2345",id:"23", team_id:"23"}
        ]
    
        const team_memberships = [
            {id: "2345",
            team_id: "23",
            student_id: "2345"}
        ]

        const mockemail = "qwe@qwe.qwe"

        const mockuser = {token: "token"};
        const mocknavigation = jest.fn();

        const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

        global.fetch= jest.fn(()=>
        Promise.resolve({
            json: ()=>  Promise.resolve({})
        })
        );
        const mockteam_rows = [
            <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
            </tr>
        ];

       
          const mockstudent_rows = [
            <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
            </tr>
        ];            
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <InstructorFeedbackTab 
            student_rows ={mockstudent_rows}
            team_rows={mockteam_rows}
              teams={mockteam} 
              org={mockorg}  
              organizations={mockOrganizations}
              courses={mockcourse}
               setLoggedIn={mocksetLoggedIn} 
                email={mockemail}
                 memberships={mockmembership} 
                 students={mockstudents} 
                  user={mockuser}
                navigation={mocknavigation}  />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
            expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Software Engineering/i));
            expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/0/i)).toBeInTheDocument();
            expect(screen.getByText(/⏳/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Team Alpha/i));
            expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/email/i)).toBeInTheDocument();
            expect(screen.getByTestId(/role/i)).toBeInTheDocument();
            expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
            expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
            expect(screen.getByText(/student/)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Sophia Taylor/i));
            expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
            expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/work ethic/i)).toBeInTheDocument();
            expect(screen.getByText(/average/i)).toBeInTheDocument();
            expect(screen.getByText(/Peers Who Reviewed/i)).toBeInTheDocument();


    });
        
     // display Badges
     it(" display Badges", ()=>{

        const mockOrganizations = [
            {id: "org1", name: "Concordia University"}
        ];

        const mockcourse = [
            {id: "23", name: "Software Engineering", organization_id: "org1"},
         
        ];
    
        const mocksetLoggedIn = jest.fn();
        const mockorg = "Concordia University"

        const mockteam =[
            {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
        ]
    
        const mockstudents =[
            {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
        ]
    
        const mockmembership =[
            {student_id:"2345",id:"23", team_id:"23"}
        ]
    
        const team_memberships = [
            {id: "2345",
            team_id: "23",
            student_id: "2345"}
        ]

        const mockemail = "qwe@qwe.qwe"

        const mockuser = {token: "token"};
        const mocknavigation = jest.fn();

        const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

        global.fetch= jest.fn(()=>
        Promise.resolve({
            json: ()=>  Promise.resolve({})
        })
        );
        const mockteam_rows = [
            <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
            </tr>
        ];

       
          const mockstudent_rows = [
            <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
            </tr>
        ];            
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <InstructorFeedbackTab 
            student_rows ={mockstudent_rows}
            team_rows={mockteam_rows}
              teams={mockteam} 
              org={mockorg}  
              organizations={mockOrganizations}
              courses={mockcourse}
               setLoggedIn={mocksetLoggedIn} 
                email={mockemail}
                 memberships={mockmembership} 
                 students={mockstudents} 
                  user={mockuser}
                navigation={mocknavigation}  />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
            expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Software Engineering/i));
            expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/0/i)).toBeInTheDocument();
            expect(screen.getByText(/⏳/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Team Alpha/i));
            expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/email/i)).toBeInTheDocument();
            expect(screen.getByTestId(/role/i)).toBeInTheDocument();
            expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
            expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
            expect(screen.getByText(/student/)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Sophia Taylor/i));
            expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
            expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/work ethic/i)).toBeInTheDocument();
            expect(screen.getByText(/average/i)).toBeInTheDocument();
            expect(screen.getByText(/Peers Who Reviewed/i)).toBeInTheDocument();
            expect(screen.getByText(/Badges/i)).toBeInTheDocument();


    });

       // display student records
       it(" display student records", ()=>{

        const mockOrganizations = [
            {id: "org1", name: "Concordia University"}
        ];

        const mockcourse = [
            {id: "23", name: "Software Engineering", organization_id: "org1"},
         
        ];
    
        const mocksetLoggedIn = jest.fn();
        const mockorg = "Concordia University"

        const mockteam =[
            {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
        ]
    
        const mockstudents =[
            {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
        ]
    
        const mockmembership =[
            {student_id:"2345",id:"23", team_id:"23"}
        ]
    
        const team_memberships = [
            {id: "2345",
            team_id: "23",
            student_id: "2345"}
        ]

        const mockemail = "qwe@qwe.qwe"

        const mockuser = {token: "token"};
        const mocknavigation = jest.fn();

        const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

        global.fetch= jest.fn(()=>
        Promise.resolve({
            json: ()=>  Promise.resolve({})
        })
        );
        const mockteam_rows = [
            <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
            </tr>
        ];

       
          const mockstudent_rows = [
            <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
            </tr>
        ];            
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <InstructorFeedbackTab 
            student_rows ={mockstudent_rows}
            team_rows={mockteam_rows}
              teams={mockteam} 
              org={mockorg}  
              organizations={mockOrganizations}
              courses={mockcourse}
               setLoggedIn={mocksetLoggedIn} 
                email={mockemail}
                 memberships={mockmembership} 
                 students={mockstudents} 
                  user={mockuser}
                navigation={mocknavigation}  />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
            expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Software Engineering/i));
            expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/0/i)).toBeInTheDocument();
            expect(screen.getByText(/⏳/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Team Alpha/i));
            expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/email/i)).toBeInTheDocument();
            expect(screen.getByTestId(/role/i)).toBeInTheDocument();
            expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
            expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
            expect(screen.getByText(/student/)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Sophia Taylor/i));
            expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
            expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/work ethic/i)).toBeInTheDocument();
            expect(screen.getByText(/average/i)).toBeInTheDocument();
            expect(screen.getByText(/Peers Who Reviewed/i)).toBeInTheDocument();
            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
            expect(screen.getByText(/Student records: Sophia Taylor/i)).toBeInTheDocument();


    });

        // can click on student to get more details
        it(" can click on student to get more details", ()=>{

            const mockOrganizations = [
                {id: "org1", name: "Concordia University"}
            ];
    
            const mockcourse = [
                {id: "23", name: "Software Engineering", organization_id: "org1"},
             
            ];
        
            const mocksetLoggedIn = jest.fn();
            const mockorg = "Concordia University"
    
            const mockteam =[
                {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
            ]
        
            const mockstudents =[
                {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
            ]
        
            const mockmembership =[
                {student_id:"2345",id:"23", team_id:"23"}
            ]
        
            const team_memberships = [
                {id: "2345",
                team_id: "23",
                student_id: "2345"}
            ]
    
            const mockemail = "qwe@qwe.qwe"
    
            const mockuser = {token: "token"};
            const mocknavigation = jest.fn();
    
            const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
            global.fetch= jest.fn(()=>
            Promise.resolve({
                json: ()=>  Promise.resolve({})
            })
            );
            const mockteam_rows = [
                <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                </tr>
            ];
    
           
              const mockstudent_rows = [
                <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                </tr>
            ];            
            render(
                <MantineProvider withGlobalStyles withNormalizeCSS>
                <MemoryRouter >
                <InstructorFeedbackTab 
                student_rows ={mockstudent_rows}
                team_rows={mockteam_rows}
                  teams={mockteam} 
                  org={mockorg}  
                  organizations={mockOrganizations}
                  courses={mockcourse}
                   setLoggedIn={mocksetLoggedIn} 
                    email={mockemail}
                     memberships={mockmembership} 
                     students={mockstudents} 
                      user={mockuser}
                    navigation={mocknavigation}  />
                </MemoryRouter>
                </MantineProvider>
                );
    
                expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Software Engineering/i));
                expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                expect(screen.getByText(/5/i)).toBeInTheDocument();
                expect(screen.getByText(/5/i)).toBeInTheDocument();
                expect(screen.getByText(/0/i)).toBeInTheDocument();
                expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Team Alpha/i));
                expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                expect(screen.getByText(/student/)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Sophia Taylor/i));
                expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
                expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
                expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
                expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();
                expect(screen.getByText(/work ethic/i)).toBeInTheDocument();
                expect(screen.getByText(/average/i)).toBeInTheDocument();
                expect(screen.getByText(/Peers Who Reviewed/i)).toBeInTheDocument();
                expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                expect(screen.getByText(/Student records: Sophia Taylor/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Team Alpha/i));

    
        });

     // display details
     it(" display details", ()=>{

        const mockOrganizations = [
            {id: "org1", name: "Concordia University"}
        ];

        const mockcourse = [
            {id: "23", name: "Software Engineering", organization_id: "org1"},
         
        ];
    
        const mocksetLoggedIn = jest.fn();
        const mockorg = "Concordia University"

        const mockteam =[
            {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
        ]
    
        const mockstudents =[
            {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
        ]
    
        const mockmembership =[
            {student_id:"2345",id:"23", team_id:"23"}
        ]
    
        const team_memberships = [
            {id: "2345",
            team_id: "23",
            student_id: "2345"}
        ]

        const mockemail = "qwe@qwe.qwe"

        const mockuser = {token: "token"};
        const mocknavigation = jest.fn();

        const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});

        global.fetch= jest.fn(()=>
        Promise.resolve({
            json: ()=>  Promise.resolve({})
        })
        );
        const mockteam_rows = [
            <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
            </tr>
        ];

       
          const mockstudent_rows = [
            <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
            </tr>
        ];            
        render(
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <MemoryRouter >
            <InstructorFeedbackTab 
            student_rows ={mockstudent_rows}
            team_rows={mockteam_rows}
              teams={mockteam} 
              org={mockorg}  
              organizations={mockOrganizations}
              courses={mockcourse}
               setLoggedIn={mocksetLoggedIn} 
                email={mockemail}
                 memberships={mockmembership} 
                 students={mockstudents} 
                  user={mockuser}
                navigation={mocknavigation}  />
            </MemoryRouter>
            </MantineProvider>
            );

            expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
            expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Software Engineering/i));
            expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
            expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/5/i)).toBeInTheDocument();
            expect(screen.getByText(/0/i)).toBeInTheDocument();
            expect(screen.getByText(/⏳/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Team Alpha/i));
            expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
            expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByTestId(/email/i)).toBeInTheDocument();
            expect(screen.getByTestId(/role/i)).toBeInTheDocument();
            expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
            expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
            expect(screen.getByText(/student/)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Sophia Taylor/i));
            expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
            expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();
            expect(screen.getByText(/work ethic/i)).toBeInTheDocument();
            expect(screen.getByText(/average/i)).toBeInTheDocument();
            expect(screen.getByText(/Peers Who Reviewed/i)).toBeInTheDocument();
            expect(screen.getByText(/Badges/i)).toBeInTheDocument();
            expect(screen.getByText(/Student records: Sophia Taylor/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/Team Alpha/i));
            expect(screen.getByText(/Details:/i)).toBeInTheDocument();

    });

        // display hide details
        it(" display hide details", ()=>{

            const mockOrganizations = [
                {id: "org1", name: "Concordia University"}
            ];
    
            const mockcourse = [
                {id: "23", name: "Software Engineering", organization_id: "org1"},
             
            ];
        
            const mocksetLoggedIn = jest.fn();
            const mockorg = "Concordia University"
    
            const mockteam =[
                {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
            ]
        
            const mockstudents =[
                {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
            ]
        
            const mockmembership =[
                {student_id:"2345",id:"23", team_id:"23"}
            ]
        
            const team_memberships = [
                {id: "2345",
                team_id: "23",
                student_id: "2345"}
            ]
    
            const mockemail = "qwe@qwe.qwe"
    
            const mockuser = {token: "token"};
            const mocknavigation = jest.fn();
    
            const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
    
            global.fetch= jest.fn(()=>
            Promise.resolve({
                json: ()=>  Promise.resolve({})
            })
            );
            const mockteam_rows = [
                <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                </tr>
            ];
    
           
              const mockstudent_rows = [
                <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                </tr>
            ];            
            render(
                <MantineProvider withGlobalStyles withNormalizeCSS>
                <MemoryRouter >
                <InstructorFeedbackTab 
                student_rows ={mockstudent_rows}
                team_rows={mockteam_rows}
                  teams={mockteam} 
                  org={mockorg}  
                  organizations={mockOrganizations}
                  courses={mockcourse}
                   setLoggedIn={mocksetLoggedIn} 
                    email={mockemail}
                     memberships={mockmembership} 
                     students={mockstudents} 
                      user={mockuser}
                    navigation={mocknavigation}  />
                </MemoryRouter>
                </MantineProvider>
                );
    
                expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Software Engineering/i));
                expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                expect(screen.getByText(/5/i)).toBeInTheDocument();
                expect(screen.getByText(/5/i)).toBeInTheDocument();
                expect(screen.getByText(/0/i)).toBeInTheDocument();
                expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Team Alpha/i));
                expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                expect(screen.getByText(/student/)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Sophia Taylor/i));
                expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
                expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
                expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
                expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();
                expect(screen.getByText(/work ethic/i)).toBeInTheDocument();
                expect(screen.getByText(/average/i)).toBeInTheDocument();
                expect(screen.getByText(/Peers Who Reviewed/i)).toBeInTheDocument();
                expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                expect(screen.getByText(/Student records: Sophia Taylor/i)).toBeInTheDocument();
                fireEvent.click(screen.getByText(/Team Alpha/i));
                expect(screen.getByText(/Details:/i)).toBeInTheDocument();
                expect(screen.getByText(/Hide Details/i)).toBeInTheDocument();

        });

             // display no records found when there are no records
             it(" display no records found when there are no records", ()=>{

                const mockOrganizations = [
                    {id: "org1", name: "Concordia University"}
                ];
        
                const mockcourse = [
                    {id: "23", name: "Software Engineering", organization_id: "org1"},
                 
                ];
            
                const mocksetLoggedIn = jest.fn();
                const mockorg = "Concordia University"
        
                const mockteam =[
                    {id:"23",name:"Team Alpha",max_size: 5, course_id:"23", size:5}
                ]
            
                const mockstudents =[
                    {organization_id: "23", id:"2345", name:"Sophia Taylor", student_id:"2345" , email:"sophia.taylor@school.com" , role:"student"}
                ]
            
                const mockmembership =[
                    {student_id:"2345",id:"23", team_id:"23"}
                ]
            
                const team_memberships = [
                    {id: "2345",
                    team_id: "23",
                    student_id: "2345"}
                ]
        
                const mockemail = "qwe@qwe.qwe"
        
                const mockuser = {token: "token"};
                const mocknavigation = jest.fn();
        
                const mockerror = jest.spyOn(console, "error").mockImplementation(()=>{});
        
                global.fetch= jest.fn(()=>
                Promise.resolve({
                    json: ()=>  Promise.resolve({})
                })
                );
                const mockteam_rows = [
                    <tr><td>Team Alpha</td> <td>5</td> <td>5</td><td>0</td><Text size="xl" role="img" aria-label="Waiting for Feedback">⏳</Text>
                    </tr>
                ];
        
               
                  const mockstudent_rows = [
                    <tr><td>Sophia Taylor</td> <td>sophia.taylor@school.com</td> <td>student</td>
                    </tr>
                ];            
                render(
                    <MantineProvider withGlobalStyles withNormalizeCSS>
                    <MemoryRouter >
                    <InstructorFeedbackTab 
                    student_rows ={mockstudent_rows}
                    team_rows={mockteam_rows}
                      teams={mockteam} 
                      org={mockorg}  
                      organizations={mockOrganizations}
                      courses={mockcourse}
                       setLoggedIn={mocksetLoggedIn} 
                        email={mockemail}
                         memberships={mockmembership} 
                         students={mockstudents} 
                          user={mockuser}
                        navigation={mocknavigation}  />
                    </MemoryRouter>
                    </MantineProvider>
                    );
        
                    expect(screen.getByText(/Course Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/instructor/i)).toBeInTheDocument();
                    expect(screen.getByText(/Organization ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Software Engineering/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Software Engineering/i));
                    expect(screen.getByText(/Back to Course List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Max Size/i)).toBeInTheDocument();
                    expect(screen.getByText(/Feedbacks from Unique Authors/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/5/i)).toBeInTheDocument();
                    expect(screen.getByText(/0/i)).toBeInTheDocument();
                    expect(screen.getByText(/⏳/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));
                    expect(screen.getByText(/Students in Team Alpha/i)).toBeInTheDocument();
                    expect(screen.getByText(/Back to Team List/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/email/i)).toBeInTheDocument();
                    expect(screen.getByTestId(/role/i)).toBeInTheDocument();
                    expect(screen.getByText(/Sophia Taylor/i)).toBeInTheDocument();
                    expect(screen.getByText(/sophia.taylor@school.com/i)).toBeInTheDocument();
                    expect(screen.getByText(/student/)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Sophia Taylor/i));
                    expect(screen.getByText(/Student ID/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Team Name/i)).toBeInTheDocument();
                    expect(screen.getByText(/Cooperation/i)).toBeInTheDocument();
                    expect(screen.getByText(/Conceptual Contribution/i)).toBeInTheDocument();
                    expect(screen.getByText(/Practical Contribution/i)).toBeInTheDocument();
                    expect(screen.getByText(/work ethic/i)).toBeInTheDocument();
                    expect(screen.getByText(/average/i)).toBeInTheDocument();
                    expect(screen.getByText(/Peers Who Reviewed/i)).toBeInTheDocument();
                    expect(screen.getByText(/Badges/i)).toBeInTheDocument();
                    expect(screen.getByText(/Student records: Sophia Taylor/i)).toBeInTheDocument();
                    fireEvent.click(screen.getByText(/Team Alpha/i));
                    expect(screen.getByText(/Details:/i)).toBeInTheDocument();
                    expect(screen.getByText(/Hide Details/i)).toBeInTheDocument();
                    expect(screen.getByText(/No Records Found!/i)).toBeInTheDocument();

            });

      
})

