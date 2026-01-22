import tkinter as tk
from tkinter import ttk
import random


class TTRSSimulator:
    def __init__(self, root):
        self.root = root
        self.root.title("TTRS Studio Simulator")
        self.root.geometry("600x600")  # Widened slightly for the side bar

        self.score = 0
        self.target_questions = 90
        self.time_left = 60
        self.game_running = False
        self.current_question_text = ""
        self.next_question_text = ""
        self.correct_answer = 0

        # Create a container for the vertical progress bar on the right
        self.progress_bar = ttk.Progressbar(root, orient="vertical", length=400, mode="determinate",
                                            maximum=self.target_questions)
        self.progress_bar.pack(side="right", padx=20, pady=20, fill="y")

        # Main content frame for the rest of the UI
        self.content_frame = tk.Frame(root)
        self.content_frame.pack(side="left", expand=True, fill="both")

        # UI Layout (attached to content_frame)
        self.timer_label = tk.Label(self.content_frame, text="Time: 60s", font=("Helvetica", 16))
        self.timer_label.pack(pady=5)

        self.progress_label = tk.Label(self.content_frame, text=f"Progress: 0/{self.target_questions}",
                                       font=("Helvetica", 12))
        self.progress_label.pack(pady=2)

        self.next_question_label = tk.Label(self.content_frame, text="", font=("Helvetica", 14), fg="gray")
        self.next_question_label.pack(pady=5)

        self.question_label = tk.Label(self.content_frame, text="Press 'Start'!", font=("Helvetica", 28, "bold"))
        self.question_label.pack(pady=10)

        self.answer_entry = tk.Entry(self.content_frame, font=("Helvetica", 24), justify='center')
        self.answer_entry.pack(pady=10)
        self.answer_entry.bind('<Return>', lambda e: self.check_answer())
        self.answer_entry.config(state=tk.DISABLED)

        self.keypad_frame = tk.Frame(self.content_frame)
        self.keypad_frame.pack(pady=10)
        self.create_keypad()

        self.status_label = tk.Label(self.content_frame, text="", font=("Helvetica", 12))
        self.status_label.pack(pady=5)

        self.start_button = tk.Button(self.content_frame, text="Start Game", font=("Helvetica", 14, "bold"),
                                      bg="#4CAF50", fg="white", command=self.start_game)
        self.start_button.pack(pady=10, ipadx=20)

    def create_keypad(self):
        buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', 'Clear', 'Enter']
        row, col = 0, 0
        for button in buttons:
            action = lambda x=button: self.click_keypad(x)
            tk.Button(self.keypad_frame, text=button, width=8, height=2, font=("Helvetica", 12, "bold"),
                      command=action).grid(row=row, column=col, padx=2, pady=2)
            col += 1
            if col > 2: col = 0; row += 1

    def click_keypad(self, key):
        if not self.game_running: return
        if key == 'Enter':
            self.check_answer()
        elif key == 'Clear':
            self.answer_entry.delete(0, tk.END)
        else:
            self.answer_entry.insert(tk.END, key)

    def start_game(self):
        if not self.game_running:
            self.game_running = True
            self.score = 0
            self.time_left = 60
            self.progress_bar['value'] = 0
            self.answer_entry.config(state=tk.NORMAL)
            self.answer_entry.delete(0, tk.END)
            self.answer_entry.focus_set()
            self.status_label.config(text="")
            self.start_button.config(state=tk.DISABLED)

            self.current_question_text, self.correct_answer = self.generate_question()
            self.next_question_text, _ = self.generate_question()
            self.update_display()
            self.countdown()

    def countdown(self):
        if self.time_left > 0 and self.game_running:
            self.time_left -= 1
            self.root.after(1000, self.countdown)
        elif self.time_left <= 0:
            self.end_game()

    def end_game(self):
        self.game_running = False
        self.question_label.config(text="Game Over!")
        self.next_question_label.config(text="")
        self.answer_entry.config(state=tk.DISABLED)
        self.start_button.config(state=tk.NORMAL)
        self.timer_label.config(text="Time: 0s")
        final_message = f"Final Questions: {self.score} ({round(60 / self.score, 2) if self.score > 0 else 0}s/q)"
        self.status_label.config(text=final_message, font=("Helvetica", 14, "bold"))

    def generate_question(self):
        num1 = random.randint(2, 12)
        num2 = random.randint(2, 12)
        if random.choice(["mult", "div"]) == "mult":
            return f"{num1} x {num2}", num1 * num2
        else:
            product = num1 * num2
            return f"{product} ÷ {num1}", num2

    def update_display(self):
        self.question_label.config(text=self.current_question_text)
        self.next_question_label.config(text=f"Next: {self.next_question_text}")

    def check_answer(self):
        if self.game_running:
            try:
                user_val = self.answer_entry.get()
                if not user_val: return

                if int(user_val) == self.correct_answer:
                    self.score += 1

                    if self.score % 5 == 0:
                        self.progress_bar['value'] = self.score

                    self.status_label.config(text="Correct!", fg="green")
                else:
                    self.status_label.config(text=f"Wrong! Answer was {self.correct_answer}", fg="red")

                self.current_question_text = self.next_question_text
                new_q, new_a = self.generate_question()
                self.next_question_text = new_q

                # Recalculate logic for the "current" question just moved from "next"
                if "x" in self.current_question_text:
                    parts = self.current_question_text.split(" x ")
                    self.correct_answer = int(parts[0]) * int(parts[1])
                else:
                    parts = self.current_question_text.split(" ÷ ")
                    self.correct_answer = int(parts[0]) // int(parts[1])

                self.update_display()
                self.answer_entry.delete(0, tk.END)
            except ValueError:
                self.answer_entry.delete(0, tk.END)


if __name__ == "__main__":
    root = tk.Tk()
    game = TTRSSimulator(root)
    root.mainloop()
