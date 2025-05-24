"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean | null;
  image: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

interface UserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  isNewUser: boolean;
}

export function UserDialog({
  user,
  isOpen,
  onClose,
  onSaved,
  isNewUser,
}: UserDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  }>({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Reset form when dialog opens/closes or user changes
    if (isOpen && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't pre-fill password for security
        isAdmin: user.isAdmin,
      });
    } else if (isOpen && isNewUser) {
      // Reset to defaults for new user
      setFormData({
        name: "",
        email: "",
        password: "",
        isAdmin: false,
      });
    }
    setErrors({});
  }, [isOpen, user, isNewUser]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (isNewUser && !formData.password) {
      newErrors.password = "Password is required for new users";
    } else if (
      formData.password &&
      formData.password.length < 8 &&
      formData.password.length > 0
    ) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isAdmin: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const endpoint = isNewUser
        ? "/api/admin/users"
        : `/api/admin/users/${user?.id}`;

      const method = isNewUser ? "POST" : "PATCH";

      const payload: Record<string, any> = {
        name: formData.name || null,
        email: formData.email,
        isAdmin: formData.isAdmin,
      };

      // Only include password if provided
      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save user");
      }

      toast({
        title: "Success",
        description: isNewUser
          ? "User created successfully"
          : "User updated successfully",
      });
      onSaved();
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isNewUser ? "Create New User" : "Edit User"}
            </DialogTitle>
            <DialogDescription>
              {isNewUser
                ? "Add a new user to the system."
                : "Update user details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="User's full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {isNewUser
                  ? "Password"
                  : "New Password (leave blank to keep current)"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isNewUser ? "Create password" : "New password"}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="isAdmin">Admin User</Label>
              <Switch
                id="isAdmin"
                checked={formData.isAdmin}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isNewUser ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
