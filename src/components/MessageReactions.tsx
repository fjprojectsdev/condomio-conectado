import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';

interface MessageReactionsProps {
  messageId: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> array de userIds
  currentUserId: string;
  onReact: (messageId: string, emoji: string) => void;
}

const MessageReactions = ({ messageId, reactions = {}, currentUserId, onReact }: MessageReactionsProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  
  const handleReaction = (emoji: string) => {
    onReact(messageId, emoji);
    setShowEmojiPicker(false);
  };

  const hasUserReacted = (emoji: string) => {
    return reactions[emoji]?.includes(currentUserId) || false;
  };

  return (
    <div className="flex items-center space-x-1 mt-1">
      {/* Reações existentes */}
      {Object.entries(reactions).map(([emoji, userIds]) => (
        <Button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          variant="ghost"
          size="sm"
          className={`h-6 px-2 text-xs transition-all duration-200 ${
            hasUserReacted(emoji)
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={`${emoji} ${userIds.length} reação${userIds.length !== 1 ? 'ões' : ''}`}
        >
          {emoji} {userIds.length}
        </Button>
      ))}
      
      {/* Botão para adicionar reação */}
      <div className="relative">
        <Button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          title="Adicionar reação"
        >
          <Smile className="h-3 w-3" />
        </Button>
        
        {/* Picker de emojis simples */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 mb-1 bg-white border rounded-lg shadow-lg p-2 flex space-x-1 z-10">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-gray-100 transition-colors duration-200 ${
                  hasUserReacted(emoji) ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                title={hasUserReacted(emoji) ? 'Remover reação' : 'Adicionar reação'}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageReactions;