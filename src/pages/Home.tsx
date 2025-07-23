import { ThreadList } from '../components/threads/ThreadList';

export function Home() {
  // AuthProvider handles user initialization, no need to duplicate here
  return <ThreadList />;
}