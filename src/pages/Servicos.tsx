// React style para atualizar lista depois de deletar
const [servicos, setServicos] = React.useState(db.servicos.getAll());

// Função para deletar serviço
const deletarServico = (id) => {
  db.servicos.delete(id);
  setServicos(db.servicos.getAll()); // Atualiza a lista depois de deletar
};

return (
  <div>
    <h2>Serviços dos Moradores</h2>

    {userName === "Síndico" && (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const novoServico = e.target.elements.servico.value;
          db.servicos.create({ nome: userName, servico: novoServico });
          setServicos(db.servicos.getAll()); // Atualiza lista após adicionar
          e.target.reset();
        }}
      >
        <input
          type="text"
          name="servico"
          placeholder="Adicionar serviço"
          required
        />
        <button type="submit">Adicionar</button>
      </form>
    )}

    <ul>
      {servicos.map((item) => (
        <li key={item.id}>
          <strong>{item.nome}</strong>: {item.servico}{" "}
          {userName === "Síndico" && (
            <button onClick={() => deletarServico(item.id)}>Deletar</button>
          )}
        </li>
      ))}
    </ul>
  </div>
);

