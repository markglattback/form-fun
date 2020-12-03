import Head from 'next/head';
import Form from 'components/Form';

export default function Home() {
  return (
    <>
      <Head>
        <title>Beautiful React Form Components</title>
      </Head>
      <div className="container">
        <Form />
      </div>
      <style jsx>{`
          .container {
            display: grid;
            place-content: center;
            height: 100vh;
            background: radial-gradient(var(--primary25), #fff);
          }
        `}
      </style>
    </>
  )
}
