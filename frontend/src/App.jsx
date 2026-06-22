import AppRouter from "./app/router/AppRouter";

import { AuthProvider } from "./app/providers/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
