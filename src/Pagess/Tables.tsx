import { observer } from 'mobx-react-lite';
import React from 'react'
import { useEffect } from 'react'
import store from './Storetype.ts';


const Tables : React.FC= observer(() => {

  useEffect(() => {
      const fetchdata = async () => {
        try {
          const employeeresponce = await fetch('http://localhost:4000/data');
          const employeedata = await employeeresponce.json();
          store.setemployee(employeedata);
    
          const managamnetresponce = await fetch('http://localhost:3500/management');
          const managmnetdata = await managamnetresponce.json();
          store.setmanagment(managmnetdata);
        } catch (error) {
          console.log(error);
        }
      };
    
      fetchdata();
    }, [store.employeevisible, store.managementvisible]);

    const handleChange1 = () =>{
      store.setemployeevisbile()
    }
    const handleChange2 = () =>{
      store.setmanagementvisible()
    }
  return (
    <div className="w-full  h-screen items-center flex justify-center">
 <div className='w-full h-full   lg:w-3/5 lg:h-4/5 lg:p-12 items-center'>
   <div className='w-full  px-4 mt-4  lg:w-96 h-auto lg:p-6 bg-white rounded-lg shadow-lg cursor-pointer'>
    <h1 className='lg:mb-4 text-lg lg:text-2xl font-bold text-gray-800'>List of Tables</h1>
    <h1
      className='mt-2 lg:text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300'
      onClick={handleChange2}
    >
      Management Table
    </h1>
    <h1
      className='mt-2 lg:text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300'
      onClick={handleChange1}
    >
      Employee Table
    </h1>
  </div>

  <div className='mt-12  p-2 lg:p-none'>
    {store.employeevisible && (
      <div className='overflow-x-auto'>
        <table className='w-full min-w-full bg-white border border-gray-300 rounded-lg'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                ID
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                 Name
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                Country
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                Gender
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
               Department
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
               City
              </th>
            </tr>
          </thead>
          <tbody>
            {store.employee.map((emp) => (
              <tr className='hover:bg-gray-100' key={emp.Id}>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.Id}</td>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.Name}</td>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.Country}</td>
                
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.Gender}</td>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.Department}</td>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.City}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {store.managementvisible && (
      <div className='overflow-x-auto mt-4'>
        <table className='min-w-full bg-white border border-gray-300 rounded-lg'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                ID
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                Title
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                Name
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                Email
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                Phone No
              </th>
              <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
                Date of Joining
              </th>
            </tr>
          </thead>
          <tbody>
            {store.management.map((man) => (
              <tr className='hover:bg-gray-100' key={man.id}>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.id}</td>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.title}</td>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.name}</td>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.email}</td>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.phone}</td>
                <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.dateOfJoining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>
</div>
  )
})

export default Tables




// 

// <div className="w-full  h-screen items-center flex justify-center">
// <div className='w-full h-full   lg:w-3/5 lg:h-4/5 lg:p-12 items-center'>
//   <div className='w-full  px-4 mt-4  lg:w-96 h-auto lg:p-6 bg-white rounded-lg shadow-lg cursor-pointer'>
//     <h1 className='lg:mb-4 text-lg lg:text-2xl font-bold text-gray-800'>List of Tables</h1>
//     <h1
//       className='mt-2 lg:text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300'
//       onClick={handleChange2}
//     >
//       Management Table
//     </h1>
//     <h1
//       className='mt-2 lg:text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300'
//       onClick={handleChange1}
//     >
//       Employee Table
//     </h1>
//   </div>

//   <div className='mt-12  p-2 lg:p-none'>
//     {Store.employeevisible && (
//       <div className='overflow-x-auto'>
//         <table className='w-full min-w-full bg-white border border-gray-300 rounded-lg'>
//           <thead className='bg-gray-200'>
//             <tr>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 ID
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 First Name
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 Job Name
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 Email
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 Phone No
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 Date of Joining
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {Store.employee.map((emp) => (
//               <tr className='hover:bg-gray-100' key={emp.employeeId}>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.employeeId}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.name}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.position}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.email}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.phone}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{emp.dateOfJoining}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     )}

//     {Store.managementvisible && (
//       <div className='overflow-x-auto mt-4'>
//         <table className='min-w-full bg-white border border-gray-300 rounded-lg'>
//           <thead className='bg-gray-200'>
//             <tr>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 ID
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 Title
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 Name
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 Email
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 Phone No
//               </th>
//               <th className='px-2 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-700 uppercase border-b'>
//                 Date of Joining
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {Store.management.map((man) => (
//               <tr className='hover:bg-gray-100' key={man.id}>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.id}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.title}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.name}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.email}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.phone}</td>
//                 <td className='px-2 lg:px-6 py-4 text-sm text-gray-900 border-b'>{man.dateOfJoining}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     )}
//   </div>
// </div>
// </div>