// Script de teste para verificar conectividade com Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBPbQuMvRIwk4dDkQmIvYf4IqcTCb61uv0",
  authDomain: "condominio-conectado-94f9f.firebaseapp.com",
  projectId: "condominio-conectado-94f9f",
  storageBucket: "condominio-conectado-94f9f.firebasestorage.app",
  messagingSenderId: "510887003433",
  appId: "1:510887003433:web:fb6184a861455c9d2ca338",
  measurementId: "G-8S2389TYYV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestoreConnection() {
  console.log('🧪 Testando conectividade com Firestore...');
  
  try {
    // Teste 1: Tentar ler mensagens existentes
    console.log('📖 Testando leitura de mensagens...');
    const messagesQuery = query(
      collection(db, 'chats', 'geral', 'messages'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    console.log(`✅ Leitura bem-sucedida! ${messagesSnapshot.size} mensagens encontradas`);
    
    // Mostrar detalhes das mensagens
    messagesSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📨 Mensagem ID: ${doc.id}`);
      console.log(`   Texto: ${data.text?.substring(0, 50)}...`);
      console.log(`   Usuário: ${data.userName} (${data.userId})`);
      console.log(`   Timestamp: ${data.timestamp}`);
      console.log('---');
    });
    
    // Teste 2: Tentar escrever uma mensagem de teste
    console.log('✍️ Testando escrita de mensagem...');
    const testMessage = {
      text: 'Mensagem de teste - ' + new Date().toISOString(),
      userId: 'test-user-' + Date.now(),
      userName: 'Usuário de Teste',
      userAvatar: '',
      image: '',
      timestamp: new Date(),
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'chats', 'geral', 'messages'), testMessage);
    console.log(`✅ Escrita bem-sucedida! Mensagem criada com ID: ${docRef.id}`);
    
    // Teste 3: Verificar se a mensagem foi salva
    console.log('🔍 Verificando se a mensagem foi salva...');
    const verifyQuery = query(
      collection(db, 'chats', 'geral', 'messages'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    
    const verifySnapshot = await getDocs(verifyQuery);
    if (verifySnapshot.size > 0) {
      const latestMessage = verifySnapshot.docs[0].data();
      console.log(`✅ Mensagem verificada! Última mensagem: ${latestMessage.text}`);
    }
    
    console.log('🎉 Todos os testes passaram! Firestore está funcionando corretamente.');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
    
    // Análise detalhada do erro
    if (error.code === 'permission-denied') {
      console.error('🚫 Erro de permissão - Verifique as regras de segurança do Firestore');
      console.error('💡 Solução: Configure as regras para permitir leitura/escrita na coleção chats');
    } else if (error.code === 'unavailable') {
      console.error('🌐 Erro de conectividade - Verifique sua conexão com a internet');
    } else if (error.code === 'unauthenticated') {
      console.error('🔐 Erro de autenticação - Verifique se o usuário está logado');
    }
    
    console.error('📋 Código de erro completo:', error.code);
    console.error('📝 Mensagem de erro:', error.message);
  }
}

// Executar o teste
testFirestoreConnection();
