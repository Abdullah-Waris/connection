import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type Archive = {
  id: string;
  author: string;
  time: string;
  message: string;
  date: [number, number, number];
  image?: string;
};

export type Post={
  id: string,
  author: string,
  time: string,
  message: string,
  date: [number, number, number]
  image?: string
};

export type Person = {
  id: string,
  name: string
};

const MOCK_ARCHIVE: Archive[] = [
  { id: uuidv4(), author: "Mom", time: "09:15", message: "Morning walk 🌳", date: [2025, 9, 29] },
  { id: uuidv4(), author: "Dad", time: "12:15", message: "Lunch 🍔", date: [2025, 9, 29] },
  { id: uuidv4(), author: "Hello", time: "12:14", message: "Lunc", date: [2025, 9, 29] },
  { id: uuidv4(), author: "Hello", time: "12:14", message: "Lunc", date: [2025, 10, 29] },
  { id: uuidv4(), author: "Hello", time: "12:14", message: "Lunc", date: [2024, 0, 29] },
  { id: uuidv4(), author: "You", time: "12:14", message: "Lunc", date: [2025, 10, 6] },
  { id: uuidv4(), author: "You", time: "12:14", message: "Lunc", date: [2025, 10, 5] },
  { id: uuidv4(), author: "You", time: "12:14", message: "Lunc", date: [2025, 10, 4] },
  { id: uuidv4(), author: "You", time: "12:14", message: "Lunc", date: [2025, 10, 3] },
];

const MOCK_POSTS: Post[] = [
  { id: '1', author: 'Mom', time: '09:15', message: 'Morning walk 🌳', date: [2025, 9, 29]},
  { id: '2', author: 'Dad', time: '12:15', message: 'Lunch 🍔', date: [2025, 9, 29]},
];

const MOCK_PEOPLE: Person[] = [
  {id: uuidv4(), name: "Mom"},
  {id: uuidv4(), name: "Dad"},
  {id: uuidv4(), name: "You"}
];

type AppContextType = {
  archive: Archive[];
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  avatar: string|null;
  setAvatar: React.Dispatch<React.SetStateAction<string|null>>;
  displayName: string|undefined;
  setDisplayName: React.Dispatch<React.SetStateAction<string|undefined>>
  totalPosts: number;
  setTotalPosts: React.Dispatch<React.SetStateAction<number>>
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [archive, setArchive] = useState(MOCK_ARCHIVE);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [avatar, setAvatar] = useState<null | string>(null);
  const [displayName, setDisplayName] = useState<string|undefined>(undefined);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [people, setPeople] = useState(MOCK_PEOPLE);
  return (
    <AppContext.Provider value={{ archive, posts, setPosts, avatar, setAvatar, displayName, setDisplayName, totalPosts, setTotalPosts, people, setPeople }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};