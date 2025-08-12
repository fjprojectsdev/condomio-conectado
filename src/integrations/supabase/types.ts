export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agendamentos_salao: {
        Row: {
          created_at: string
          data_evento: string
          horario_fim: string
          horario_inicio: string
          id: string
          nome_solicitante: string
          observacoes: string | null
          status: string
          telefone: string
          tipo_evento: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data_evento: string
          horario_fim: string
          horario_inicio: string
          id?: string
          nome_solicitante: string
          observacoes?: string | null
          status?: string
          telefone: string
          tipo_evento: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data_evento?: string
          horario_fim?: string
          horario_inicio?: string
          id?: string
          nome_solicitante?: string
          observacoes?: string | null
          status?: string
          telefone?: string
          tipo_evento?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      classificados: {
        Row: {
          apartamento: string
          ativo: boolean
          bloco: string | null
          categoria: Database["public"]["Enums"]["classificado_categoria"]
          created_at: string
          descricao: string
          id: string
          nome_contato: string
          preco: number | null
          telefone: string
          titulo: string
          updated_at: string
        }
        Insert: {
          apartamento: string
          ativo?: boolean
          bloco?: string | null
          categoria: Database["public"]["Enums"]["classificado_categoria"]
          created_at?: string
          descricao: string
          id?: string
          nome_contato: string
          preco?: number | null
          telefone: string
          titulo: string
          updated_at?: string
        }
        Update: {
          apartamento?: string
          ativo?: boolean
          bloco?: string | null
          categoria?: Database["public"]["Enums"]["classificado_categoria"]
          created_at?: string
          descricao?: string
          id?: string
          nome_contato?: string
          preco?: number | null
          telefone?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      coleta_lixo: {
        Row: {
          created_at: string
          dia_da_semana: string
          id: string
          tipo_de_lixo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dia_da_semana: string
          id?: string
          tipo_de_lixo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dia_da_semana?: string
          id?: string
          tipo_de_lixo?: string
          updated_at?: string
        }
        Relationships: []
      }
      comunicados: {
        Row: {
          created_at: string
          data: string
          id: string
          mensagem: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: string
          id?: string
          mensagem: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          mensagem?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      encomendas: {
        Row: {
          apartamento: number
          bloco: string | null
          created_at: string
          descricao: string
          id: string
          nome_morador: string
          recebida: boolean
          updated_at: string
        }
        Insert: {
          apartamento: number
          bloco?: string | null
          created_at?: string
          descricao: string
          id?: string
          nome_morador: string
          recebida?: boolean
          updated_at?: string
        }
        Update: {
          apartamento?: number
          bloco?: string | null
          created_at?: string
          descricao?: string
          id?: string
          nome_morador?: string
          recebida?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          apartamento: string | null
          bloco: string | null
          created_at: string
          display_name: string | null
          id: string
          is_prestador: boolean
          telefone: string | null
          updated_at: string
          username: string
        }
        Insert: {
          apartamento?: string | null
          bloco?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_prestador?: boolean
          telefone?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          apartamento?: string | null
          bloco?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_prestador?: boolean
          telefone?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      servicos_moradores: {
        Row: {
          apartamento: number
          bloco: string | null
          created_at: string
          id: string
          nome_morador: string
          status: string
          telefone: string | null
          tipo_servico: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          apartamento: number
          bloco?: string | null
          created_at?: string
          id?: string
          nome_morador: string
          status?: string
          telefone?: string | null
          tipo_servico: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          apartamento?: number
          bloco?: string | null
          created_at?: string
          id?: string
          nome_morador?: string
          status?: string
          telefone?: string | null
          tipo_servico?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sugestoes: {
        Row: {
          apartamento: number | null
          bloco: string | null
          created_at: string
          id: string
          mensagem: string
          nome: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          apartamento?: number | null
          bloco?: string | null
          created_at?: string
          id?: string
          mensagem: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          apartamento?: number | null
          bloco?: string | null
          created_at?: string
          id?: string
          mensagem?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      agendamento_status: "pendente" | "confirmado" | "cancelado"
      app_role: "admin" | "user"
      classificado_categoria:
        | "venda"
        | "compra"
        | "servico"
        | "doacao"
        | "troca"
        | "aluguel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agendamento_status: ["pendente", "confirmado", "cancelado"],
      app_role: ["admin", "user"],
      classificado_categoria: ["venda", "compra", "servico", "doacao", "troca", "aluguel"],
    },
  },
} as const
