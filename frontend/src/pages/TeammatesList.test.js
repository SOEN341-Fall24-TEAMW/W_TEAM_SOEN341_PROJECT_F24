import React from "react";
import {act} from "react";
import { render, screen, fireEvent, waitFor, within, getAllByRole } from "@testing-library/react";
import PeerEvaluationForm from './peerEvaluationForm';
import { MemoryRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import fetchMock from 'jest-fetch-mock';
import { useNavigate, useSearchParams } from 'react-router-dom';

fetchMock.enableMocks();
