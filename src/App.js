import React, { useState, useEffect, useCallback } from "react";
import api from './services/api'

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data)
    });
  },[])

  async function handleAddRepository() {
    const response = await api.post('repositories', {
          "title": `Nodejs Adonisjs ${Date.now()}`,
          "url": "https:github.com",
          "techs": [
            "eslint",
            "prettier"
          ]
    })

    setRepositories([response.data, ...repositories])
  }

  const handleRemoveRepository = useCallback(
    (id) => {
      api.delete(`/repositories/${id}`);

      setRepositories((repo) =>
        repo.filter((repository) => repository.id !== id)
      );
    },
    [setRepositories]
  );
  
  async function handleLikesRepository(id){
    const response = await api.post(`repositories/${id}/like`);
    const responseLike = response.data;
    setRepositories(repositories.map(repository => repository.id === responseLike.id ? repository = responseLike :repository))
  }

  return (
    <div>
      <button onClick={handleAddRepository}>Adicionar</button>
      <ul data-testid="repository-list">
       {repositories.map(repository => (  
        <li key={repository.id}>
          {repository.title}
          <button onClick={() => handleRemoveRepository(repository.id)}>
            Remover
          </button>
          <button className="like" onClick={() => handleLikesRepository(repository.id)}>
          <small>{repository.likes}</small> {repository.likes > 0 ? '🚀' : ''} Like
          </button>
        </li>
       ))}
      </ul>
    </div>
  );
}

export default App;
