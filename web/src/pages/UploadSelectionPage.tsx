import { useLocation } from 'react-router-dom';
import { GPTResponse } from '../types/types';

export default function UploadSelectionPage() {
  const location = useLocation();
  const responseData = location.state;

  return (
    <div className="justify-start">
      <div className="flex">
        {responseData ? (
          <ul>
            {responseData.map((element: GPTResponse, index: number) => {
              return (
                <div className='m-4'>
                  <h1 className="flex text-4xl underline">Paper {index}</h1>
                  <div className="grid grid-cols-3">
                    <div className="col-span-1">
                      <p className="flex text-xl font-bold">Pass 1</p>
                      <h2 className="flex">
                        <span className="font-bold">Name: </span>
                        {element.pass_1.paper_name}
                      </h2>
                      <p className="flex">
                        <span className="font-bold">Author: </span>
                        {element.pass_1.author.join()}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Manufacturer:</span>{' '}
                        {element.pass_1.manufacturer}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Testing Type:</span>{' '}
                        {element.pass_1.testing_type}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Year:</span>{' '}
                        {element.pass_1.year}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Device Type:</span>{' '}
                        {element.pass_1.type}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Testing Location:</span>{' '}
                        {element.pass_1.testing_location}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Part Number:</span>{' '}
                        {element.pass_1.part_no}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="flex text-xl font-bold">Pass 2</p>
                      <h2 className="flex">
                        <span className="font-bold">Name: </span>
                        {element.pass_2.paper_name}
                      </h2>
                      <p className="flex">
                        <span className="font-bold">Author: </span>
                        {element.pass_2.author.join()}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Manufacturer:</span>{' '}
                        {element.pass_2.manufacturer}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Testing Type:</span>{' '}
                        {element.pass_2.testing_type}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Year:</span>{' '}
                        {element.pass_2.year}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Device Type:</span>{' '}
                        {element.pass_2.type}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Testing Location:</span>{' '}
                        {element.pass_2.testing_location}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Part Number:</span>{' '}
                        {element.pass_2.part_no}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="flex text-xl font-bold">Pass 3</p>
                      <h2 className="flex">
                        <span className="font-bold">Name: </span>
                        {element.pass_3.paper_name}
                      </h2>
                      <p className="flex">
                        <span className="font-bold">Author: </span>
                        {element.pass_3.author.join()}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Manufacturer:</span>{' '}
                        {element.pass_3.manufacturer}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Testing Type:</span>{' '}
                        {element.pass_3.testing_type}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Year:</span>{' '}
                        {element.pass_3.year}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Device Type:</span>{' '}
                        {element.pass_3.type}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Testing Location:</span>{' '}
                        {element.pass_3.testing_location}
                      </p>
                      <p className="flex">
                        <span className="font-bold">Part Number:</span>{' '}
                        {element.pass_3.part_no}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
        ) : (
          /*
                <p>{JSON.stringify(responseData, null, 2)}</p>
               */
          <p>No data available</p>
        )}
      </div>
    </div>
  );
}
