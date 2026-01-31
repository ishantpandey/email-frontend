import { Button } from "primereact/button";
import { MdStar, MdStarBorder, MdAttachment, MdReply, MdForward, MdDelete, MdArrowBack, MdMoreVert } from "react-icons/md";
import { Menu } from "primereact/menu";
import React from "react";

export default function ViewMailHeaderActions({
  starred,
  handleStarToggle,
  handleReply,
  handleForward,
  handleDelete,
  menuRef,
  menuItems,
  dispatch,
  router
}) {
  return (
    <div className="flex items-center justify-between">
      {/* Back button - only visible on small devices */}
      <Button
        icon={<MdArrowBack className="w-5 h-5" />}
        onClick={() => {
          dispatch?.(null);
          router?.push && router.push('/mail');
        }}
        className="p-1 lg:hidden"
        text
        tooltip="Back to inbox"
        tooltipOptions={{ position: 'bottom' }}
        style={{ color: "#6b7280" }}
      />
      {/* Spacer for large screens */}
      <div className="hidden lg:block w-8"></div>
      <div className="flex items-center gap-2">
        <Button
          icon={starred ? <MdStar className="w-5 h-5" /> : <MdStarBorder className="w-5 h-5" />}
          onClick={handleStarToggle}
          className="p-1"
          text
          tooltip={starred ? "Remove star" : "Add star"}
          tooltipOptions={{ position: 'bottom' }}
          style={{ color: starred ? "#f97316" : "#6b7280" }}
        />
        <Button
          icon={<MdReply className="w-5 h-5" />}
          onClick={handleReply}
          className="p-1"
          text
          tooltip="Reply"
          tooltipOptions={{ position: 'bottom' }}
          style={{ color: "#f97316" }}
        />
        <Button
          icon={<MdForward className="w-5 h-5" />}
          onClick={handleForward}
          className="p-1"
          text
          tooltip="Forward"
          tooltipOptions={{ position: 'bottom' }}
          style={{ color: "#f97316" }}
        />
        <Button
          icon={<MdDelete className="w-5 h-5" />}
          onClick={handleDelete}
          className="p-1"
          text
          tooltip="Delete"
          tooltipOptions={{ position: 'bottom' }}
          style={{ color: "#ef4444" }}
        />
        <Button
          icon={<MdMoreVert className="w-5 h-5" />}
          onClick={(e) => menuRef.current.toggle(e)}
          className="p-1"
          text
          tooltip="More options"
          tooltipOptions={{ position: 'bottom' }}
          style={{ color: "#6b7280" }}
        />
        <Menu
          ref={menuRef}
          model={menuItems}
          popup
        />
      </div>
    </div>
  );
}
