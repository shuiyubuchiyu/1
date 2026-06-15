#!/usr/bin/env python3
"""温度转换器 - 支持摄氏度和华氏度之间的转换"""

from typing import Union


def celsius_to_fahrenheit(celsius: float) -> float:
    """将摄氏度转换为华氏度"""
    return celsius * 1.8 + 32


def fahrenheit_to_celsius(fahrenheit: float) -> float:
    """将华氏度转换为摄氏度"""
    return (fahrenheit - 32) * 5 / 9


def get_user_choice() -> str:
    """获取用户选择，带输入验证"""
    while True:
        choice = input("请选择功能（1/2）：").strip()
        if choice in ("1", "2"):
            return choice
        print("无效选择，请输入 1 或 2。")


def get_temperature(prompt: str) -> float:
    """获取温度输入，带错误处理"""
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("无效输入，请输入数字。")


def main():
    """主函数 - 温度转换器入口"""
    print("温度转换器")
    print("1. 摄氏度转华氏度")
    print("2. 华氏度转摄氏度")

    choice = get_user_choice()

    if choice == "1":
        celsius = get_temperature("请输入摄氏度：")
        fahrenheit = celsius_to_fahrenheit(celsius)
        print(f"{celsius:.2f} 摄氏度 = {fahrenheit:.2f} 华氏度")
    else:  # choice == "2"
        fahrenheit = get_temperature("请输入华氏度：")
        celsius = fahrenheit_to_celsius(fahrenheit)
        print(f"{fahrenheit:.2f} 华氏度 = {celsius:.2f} 摄氏度")


if __name__ == "__main__":
    main()
