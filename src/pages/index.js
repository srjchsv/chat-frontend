import Link from 'next/link';

function Home() {
  return (
    <div className="container">
      <h1>Real-Time Chat App</h1>
      <p>
        Please{' '}
        <Link legacyBehavior href="/register">
          <a className="link">Register</a>
        </Link>{' '}
        or{' '}
        <Link legacyBehavior href="/login">
          <a className="link">Login</a>
        </Link>{' '}
        to start chatting!
      </p>
   
    </div>
  );
}

export default Home;
