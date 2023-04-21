import Image from 'next/image'
import { Inter } from 'next/font/google'
import { AppProps } from 'next/app';
import { useState } from 'react';

interface weather {
  city: string,
  temp: number,
}

interface HomeProp {
  data: weather[]
}

const inter = Inter({ subsets: ['latin'] })

function HomePage({ data }: HomeProp) {
  const [tableData, setTableData] = useState(data);
  const [sortField, setSortField] = useState('');

  const refreshData = async () => {
    const res = await fetch('http://localhost:8001/city/weatherTemp');
    const newData: weather[] = await res.json();
    setTableData(newData);
  };

  const handleClick = async () => {
    await refreshData();
  };

  const handleSort = (field: string) => {
    let sortedData = [...tableData];
    if (sortField === field) {
      sortedData.reverse();
    } else {
      if (field === 'city') {
        sortedData.sort((a, b) => a.city.localeCompare(b.city));
      } else if (field === 'temp') {
        sortedData.sort((a, b) => a.temp - b.temp);
      }
    }
    setTableData(sortedData);
    setSortField(field);
  };

  return (
    <>
      <table style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>
              City
              <button onClick={() => handleSort('city')} style={{ marginLeft: '10px' }}>
                {sortField === 'city' ? '↓' : '↑'}
              </button>
            </th>
            <th>
              Temperature
              <button onClick={() => handleSort('temp')} style={{ marginLeft: '10px' }}>
                {sortField === 'temp' ? '↓' : '↑'}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((d) => (
            <tr key={d.city}>
              <td style={{ padding: '10px', border: '1px solid black' }}>{d.city}</td>
              <td style={{ padding: '10px', border: '1px solid black' }}>{d.temp} °C</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleClick} style={{ backgroundColor: 'green', padding: '15px 20px', marginLeft: '10px',transition: 'background-color 0.3s ease',
    cursor: 'pointer' }}
    >
        Refresh Now
      </button>
    </>
  );
}
export default HomePage;
