import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { Block, Button} from 'konsta/react';


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const { doLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const success = await doLogin(email, password);
      if (!success) {
        setError('Neplatné přihlašovací údaje.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Block strong inset outline>
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Sign in</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="any@email.cz"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="any password"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <Button
          disabled={loading}
          className=""
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Block>
  );


}
