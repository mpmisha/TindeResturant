import React from 'react';
interface ModeSelectionProps {
    onModeSelected: (mode: 'new' | 'join', tableId: string, userId: string, userName: string) => void;
    restaurantId: string;
}
declare const ModeSelection: React.FC<ModeSelectionProps>;
export default ModeSelection;
//# sourceMappingURL=ModeSelection.d.ts.map