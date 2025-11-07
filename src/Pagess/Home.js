import React, { useEffect, useState } from 'react'
import Navbar from '../Component/Navbar'
import Sidebar from '../Component/Sidebar'
import Store from '../Store'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import "../FlowMain/Flow.css"
import "../FlowMain/Pop.css"
import Swal from 'sweetalert2'
import DatabasePopup from "./DatabasePopup"

const Home = observer(() => {
  const [value, setvalue] = useState('')
  const navigate = useNavigate()

  const dashboarddata = async (dashboardName) => {
    Store.isSidebarVisible = false
    Store.dashboard = dashboardName
    Store.name3 = []
    Store.nodes = []
    Store.treeData = {}
    Store.edges = []
    Store.validateeeeee = {}
    Store.sampleNodes = {}
    Store.sampleEdges = {}
    Store.samplelastn = {}
    Store.samplelaste = {}
    Store.activeNode = ''

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please log in to restore your flow')
      return
    }

    try {
      const response = await fetch(`http://localhost:4000/api/flow/restore/${dashboardName}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to fetch flow data')

      const data = await response.json()

      if (data.file) {
        Store.find = true
        Store.name3 = data.file
        Object.assign(Store.sampleNodes, data.nodes)
        Object.assign(Store.sampleEdges, data.edges)
        Object.assign(Store.samplelastn, data.nodes1)
        Object.assign(Store.samplelaste, data.edges1)
        Object.assign(Store.validateeeeee, data.node)
        Store.countt = data.countt
        Store.counter = data.counter
        Store.activeNode = data.active
        Store.nodes = data.no
        Store.edges = data.ed
        Store.count = data.count
        Store.nodeIdCounter = data.nodeIdCounter
        Store.thistext = data.thistext
        Store.value1 = data.value1
        Store.tableName = data.tabelname
        Store.tableindex = data.tableindex
        Store.key1value = data.key1value
        Store.key2value = data.key2value
        Store.found = data.found
        Store.coun = data.coun
        Object.assign(Store.storerule, data.action)

        navigate('/flow')

        console.log(JSON.stringify(Store.name3))
        Store.visibile4 = false
        Swal.fire({
          icon: 'success',
          title: ' successfully Restored',
          showConfirmButton: true,
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No data Found',
          showConfirmButton: true,
        })
      }
    } catch (error) {
      console.error('Error restoring flow:', error)
    }
  }

  useEffect(() => {
    let value = localStorage.getItem('username')
    Store.username = value
    Store.nodes = []
    Store.edges = []
    Store.tablename = ""
    Store.name3 = []
    Store.treeData = {}
  }, [])

  const handle = () => {
    navigate("/")
    Store.setusername("")
    Store.setpassword("")
    localStorage.removeItem('username')
    Store.username = 'Login'
    window.location.reload()

    Store.nodes = []
    Store.edges = []
    Store.tablename = ""
    Store.name3 = []
    Store.countt = ''
    Store.counter = ''
    Store.validateeeeee = {}
    Store.sampleNodes = {}
    Store.sampleEdges = {}
    Store.samplelastn = {}
    Store.samplelaste = {}
    Store.activeNode = ''
    Store.treeData = {}
    Store.storerule = {}
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:4000/api/dashboard/names', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          Store.dashboardArray = data.dashboardNames
        } else {
          console.error('Failed to fetch dashboard data:', response.status)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [Store.visibile4])

  return (
    <div className='relative'>
      <Navbar />
      <div className='lg:flex'>
        <Sidebar />

        <h1 className={`top-[1rem] w-48 text-xs lg:text-xl left-[7rem] lg:absolute lg:left-40  lg:top-[1rem] transition-all duration-300 ease-in-out  font-semibold text-blue-600 mx-auto my-auto hover:text-blue-800 transition-colors duration-300 ${Store.visibile4 ? "opacity-50 backdrop-blur-md" : "opacity-100"}`}>**</h1>

        <div className={`grid-cols-3 w-full h-screen lg:mt-[3.5rem] grid lg:gap-2 lg:grid-cols-4 justify-items-center items-center relative transition-all duration-300 ease-in-out z-10 ${Store.visibile4 ? "opacity-50 backdrop-blur-md" : "opacity-100"} lg:z-0`}>
          {Array.isArray(Store.iconsArray) && Store.iconsArray.map((item) => (
            <div
              className='w-24 h-24 flex flex-col justify-center items-center bg-white lg:w-[11rem] lg:h-[9rem] rounded-full cursor-pointer transform transition-transform duration-300 hover:scale-110'
              key={item.id}
              onClick={() => Store.setvisible4(item.id)}
            >
              <i className='text-2xl lg:text-5xl'>{<item.icons />}</i>
              <h1 className='text-xs lg:text-xl lg:mt-2'>{item.iconname}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ New Popup integrated */}
      {Store.visibile4 && (
        <DatabasePopup onClose={() => (Store.visibile4 = false)} />
      )}

      <div className={`hidden absolute bg-white w-28 h-12 top-8 right-20 lg:items-center lg : flex lg:justify-center transition-transform duration-300 ease-in-out transform lg:flex ${Store.visible2 ? 'translate-y-full' : 'translate-y-0'}`}>
        <h1 onClick={handle}>Logout</h1>
      </div>
    </div>
  )
})

export default Home
