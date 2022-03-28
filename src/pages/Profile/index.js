import React, { useState, useEffect, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../services/api'

import Logo from '../../assets/Logo.svg'

import './styles.css'

export default function Profile() {
  const [incidents, setIncidents] = useState([])

  const history = useHistory()

  const ongId = localStorage.getItem('ongId')
  const ongName = localStorage.getItem('ongName')

  const load = useCallback(async () => {
    console.log({ ongId })

    const response = await api.get('profile', {
      headers: { Authorization: ongId }
    })

    console.log({ response })
    setIncidents(response.data)
  }, [ongId])

  async function handleDeleteIncident(id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ongId
        }
      })

      setIncidents(incidents.filter(incident => incident.id !== id))
    } catch (err) {
      alert('Erro ao deletar caso')
    }
  }

  function handleLogout() {
    localStorage.clear()
    history.push('/')
  }
  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="profile-container">
      <header>
        <img src={Logo} alt="Be the Hero" />
        <span>Bem vinda, {ongName}</span>

        <Link className="button" to="incidents/new">
          Cadastrar Novo Caso
        </Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#E02041" />
        </button>
      </header>

      <h1> Casos cadastrados</h1>

      <ul>
        {incidents.map(incident => (
          <li key={incident.id}>
            <strong>CASO:</strong>
            <p>{incident.title}</p>

            <strong>DESCRIÇÃO:</strong>
            <p>{incident.description}</p>

            <strong>VALOR:</strong>
            <p>
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(incident.value)}
              {/* COLOCAR FORMATO BRL */}
            </p>

            <button
              onClick={() => handleDeleteIncident(incident.id)}
              type="button"
            >
              <FiTrash2 size={20} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
