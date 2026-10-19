import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import * as S from '../patterns/screens';

const meta: Meta = { title: 'Patterns/Lisbon scenario', parameters: { screen: 'full', docs: { description: { component: 'Full iPhone 17 screens for one trip: seven friends, one dinner poll, one bottle of wine Ren and Nic skipped, and the settle-up.' } } } };
export default meta;
type St = StoryObj;
export const Home: St = { name: '1 · Home, all trips', render: () => <S.HomeScreen /> };
export const TripGroup: St = { name: '2 · Trip group, add Ren', parameters: { statusLight: true }, render: () => <S.TripGroupScreen /> };
export const PollCreate: St = { name: '3 · Create a poll', render: () => <S.PollCreateScreen /> };
export const LivePoll: St = { name: '4 · Live poll', render: () => <S.LivePollScreen /> };
export const ItineraryWinner: St = { name: '5 · Itinerary with winner', render: () => <S.ItineraryWinnerScreen /> };
export const AddExpense: St = { name: '6 · Add expense, wine without Ren and Nic', render: () => <S.AddExpenseScreen /> };
export const Balances: St = { name: '7 · Balances, simplified', render: () => <S.BalancesScreen /> };
export const Settle: St = { name: '8 · Settle', render: () => <S.SettleScreen /> };
export const SquaredUp: St = { name: '9 · All squared up', render: () => <S.SquaredUpScreen /> };
