import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Modal from "./Modal";

export function TabsLine() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview" onClick={() => setIsModalOpen(true)}>
            Notificações
          </TabsTrigger>

          <a href="/profile">
            <TabsTrigger value="analytics">Perfil</TabsTrigger>
          </a>
        </TabsList>
      </Tabs>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Suas Notificações"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Você não tem notificações novas no momento.
          </p>
        </div>
      </Modal>
    </div>
  );
}
