// Teste simples de conectividade com Firestore
// Execute este arquivo no navegador para testar

console.log('🧪 Iniciando teste simples de conectividade...');

// Verificar se o Firebase está disponível
if (typeof firebase === 'undefined') {
  console.error('❌ Firebase não está disponível!');
  console.log('💡 Certifique-se de que o Firebase está carregado na página');
} else {
  console.log('✅ Firebase está disponível');
}

// Verificar se o Firestore está disponível
if (typeof firebase.firestore === 'undefined') {
  console.error('❌ Firestore não está disponível!');
} else {
  console.log('✅ Firestore está disponível');
}

// Função para testar conectividade básica
async function testBasicConnection() {
  try {
    console.log('🔍 Testando conectividade básica...');
    
    // Tentar acessar a coleção
    const db = firebase.firestore();
    const chatRef = db.collection('chats').doc('geral').collection('messages');
    
    console.log('📚 Referência da coleção criada:', chatRef.path);
    
    // Tentar ler documentos (pode falhar por permissões, mas deve conectar)
    const snapshot = await chatRef.limit(1).get();
    console.log('✅ Conectividade básica OK!');
    console.log(`📊 Documentos encontrados: ${snapshot.size}`);
    
    if (snapshot.size > 0) {
      const doc = snapshot.docs[0];
      console.log('📄 Primeiro documento:', doc.data());
    }
    
  } catch (error) {
    console.error('❌ Erro na conectividade básica:', error);
    console.log('📋 Código de erro:', error.code);
    console.log('📝 Mensagem:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('🚫 Erro de permissão - As regras podem não estar funcionando ainda');
    } else if (error.code === 'unavailable') {
      console.log('🌐 Erro de conectividade - Verifique sua internet');
    }
  }
}

// Função para testar escrita (pode falhar por permissões)
async function testWritePermission() {
  try {
    console.log('✍️ Testando permissão de escrita...');
    
    const db = firebase.firestore();
    const chatRef = db.collection('chats').doc('geral').collection('messages');
    
    const testMessage = {
      text: 'Teste de permissão - ' + new Date().toISOString(),
      userId: 'test-user',
      userName: 'Usuário de Teste',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString()
    };
    
    const docRef = await chatRef.add(testMessage);
    console.log('✅ Escrita bem-sucedida! ID:', docRef.id);
    
    // Limpar a mensagem de teste
    await docRef.delete();
    console.log('🧹 Mensagem de teste removida');
    
  } catch (error) {
    console.error('❌ Erro na escrita:', error);
    console.log('📋 Código:', error.code);
    
    if (error.code === 'permission-denied') {
      console.log('🚫 Sem permissão para escrever - Verifique as regras do Firestore');
    }
  }
}

// Executar testes
console.log('🚀 Executando testes...');
testBasicConnection().then(() => {
  console.log('⏳ Aguardando 2 segundos para testar escrita...');
  setTimeout(testWritePermission, 2000);
});

console.log('📋 Para ver os resultados, abra o console do navegador (F12)');
